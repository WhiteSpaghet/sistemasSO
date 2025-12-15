# backend/core/dispatcher.py
import math
import threading
import time
import queue
from typing import Dict, Tuple, Optional, List

from .models import Taxi, Cliente, Viaje
from .clock import SimulatedClock
from backend import config as cfg


class Dispatcher:
    """
    Sistema central: gestiona taxis, clientes, viajes, contabilidad y métricas.
    Usa semáforos binarios y Condition para sincronizar.
    """

    def __init__(self, clock: SimulatedClock):
        self.clock = clock

        self.taxis: Dict[int, Taxi] = {}
        self.clientes: Dict[int, Cliente] = {}
        self.viajes: Dict[int, Viaje] = {}
        self._next_viaje_id = 1

        # semáforos binarios para recursos críticos
        self.sem_taxis = threading.Semaphore(1)
        self.sem_clientes = threading.Semaphore(1)
        self.sem_viajes = threading.Semaphore(1)
        self.sem_contabilidad = threading.Semaphore(1)

        # Condition para esperar taxis libres
        self.lock_match = threading.Lock()
        self.cond_taxi_disponible = threading.Condition(self.lock_match)

        # Cola de viajes por taxi
        self.taxi_queues: Dict[int, "queue.Queue[int]"] = {}

        # Contabilidad
        self.ganancias_empresa_dia: float = 0.0
        self.ganancias_empresa_mes: float = 0.0
        self._ultimo_cierre_fecha = self.clock.now().date()

        # Métricas
        self.total_viajes = 0
        self.total_espera = 0.0
        self.total_espera_count = 0

        self._lock_metrics = threading.Lock()

    # ---------- Registro de entidades ----------

    def registrar_cliente(self, cliente: Cliente) -> None:
        with self.sem_clientes:
            self.clientes[cliente.id] = cliente

    def registrar_taxi(self, taxi: Taxi) -> None:
        with self.sem_taxis:
            self.taxis[taxi.id] = taxi
            self.taxi_queues[taxi.id] = queue.Queue()

    # ---------- Lógica de viajes ----------

    def solicitar_viaje(self, cliente_id: int, destino: Tuple[float, float]) -> Optional[int]:
        """
        Llamado por un 'cliente' (API o hilo) para pedir un taxi.
        Bloquea hasta encontrar taxi libre (en radio 2km).
        """
        with self.sem_clientes:
            cliente = self.clientes.get(cliente_id)

        if cliente is None:
            return None

        origen = (cliente.x, cliente.y)
        hora_solicitud = time.time()

        # Buscar taxi
        with self.cond_taxi_disponible:
            taxi = self._buscar_taxi_mas_cercano(origen)

            while taxi is None:
                # Esperar a que algún taxi se libere
                self.cond_taxi_disponible.wait()
                taxi = self._buscar_taxi_mas_cercano(origen)

            # Marcamos taxi ocupado
            taxi.ocupado = True

        # Crear viaje
        with self.sem_viajes:
            viaje_id = self._next_viaje_id
            self._next_viaje_id += 1

            tarifa = self._calcular_tarifa(origen, destino)

            v = Viaje(
                id=viaje_id,
                cliente_id=cliente_id,
                taxi_id=taxi.id,
                origen=origen,
                destino=destino,
                tarifa=tarifa,
                estado="pendiente",
                hora_solicitud=hora_solicitud
            )
            self.viajes[viaje_id] = v

        # Enviar viaje a la cola del taxi
        self._enviar_viaje_a_taxi(taxi.id, viaje_id)

        return viaje_id

    def _buscar_taxi_mas_cercano(self, origen: Tuple[float, float]) -> Optional[Taxi]:
        mejor = None
        mejor_dist = None

        for taxi in self.taxis.values():
            if taxi.ocupado:
                continue
            dist = math.dist((taxi.x, taxi.y), origen)
            if dist <= cfg.RADIO_BUSQUEDA_KM:
                if mejor is None or dist < mejor_dist or (dist == mejor_dist and taxi.rating > mejor.rating):
                    mejor = taxi
                    mejor_dist = dist
        return mejor

    def _calcular_tarifa(self, origen: Tuple[float, float], destino: Tuple[float, float]) -> float:
        dist = math.dist(origen, destino)
        base = 3.0
        por_km = 1.5
        return round(base + por_km * dist, 2)

    def _enviar_viaje_a_taxi(self, taxi_id: int, viaje_id: int) -> None:
        cola = self.taxi_queues.get(taxi_id)
        if cola:
            cola.put(viaje_id)

    def tomar_viaje_taxi(self, taxi_id: int) -> Optional[Viaje]:
        """
        Llamado desde el hilo del taxi: espera hasta recibir nuevo viaje.
        """
        cola = self.taxi_queues.get(taxi_id)
        if cola is None:
            return None
        viaje_id = cola.get()  # bloquea
        with self.sem_viajes:
            viaje = self.viajes.get(viaje_id)
        if viaje:
            viaje.estado = "en_curso"
            viaje.hora_asignacion = time.time()

            # Actualizar métricas de espera
            if viaje.tiempo_espera() is not None:
                with self._lock_metrics:
                    self.total_espera += viaje.tiempo_espera()
                    self.total_espera_count += 1
        return viaje

    def finalizar_viaje(self, viaje_id: int) -> None:
        with self.sem_viajes:
            viaje = self.viajes.get(viaje_id)
        if not viaje:
            return

        viaje.estado = "finalizado"
        viaje.hora_fin = time.time()

        # Contabilidad
        with self.sem_contabilidad:
            # 80% para taxista, 20% empresa
            parte_taxista = viaje.tarifa * (1 - cfg.COMISION_EMPRESA)
            parte_empresa = viaje.tarifa * cfg.COMISION_EMPRESA

            taxi = self.taxis.get(viaje.taxi_id)
            if taxi:
                taxi.ganancias_dia += parte_taxista

            self.ganancias_empresa_dia += parte_empresa

        # Métricas
        with self._lock_metrics:
            self.total_viajes += 1

        # Liberar taxi
        taxi = self.taxis.get(viaje.taxi_id)
        if taxi:
            with self.cond_taxi_disponible:
                taxi.ocupado = False
                self.cond_taxi_disponible.notify_all()

    # ---------- Cierre diario / mensual ----------

    def cierre_diario_si_corresponde(self) -> None:
        """
        Llamado periódicamente por un hilo de fondo.
        Si cambia el día simulado, acumula las ganancias del día en el mes.
        """
        ahora = self.clock.now()
        fecha_actual = ahora.date()

        if fecha_actual != self._ultimo_cierre_fecha and ahora.hour >= 12:
            with self.sem_contabilidad:
                self.ganancias_empresa_mes += self.ganancias_empresa_dia
                self.ganancias_empresa_dia = 0.0
            self._ultimo_cierre_fecha = fecha_actual

            # reset de ganancias diarias de taxis
            with self.sem_taxis:
                for taxi in self.taxis.values():
                    taxi.ganancias_dia = 0.0

    # ---------- Consultas para API ----------

    def estado_cliente(self, cliente_id: int) -> Dict:
        with self.sem_viajes:
            viajes_cliente = [
                v for v in self.viajes.values() if v.cliente_id == cliente_id
            ]
        viajes_cliente.sort(key=lambda v: v.id, reverse=True)
        actual = viajes_cliente[0] if viajes_cliente else None

        if not actual:
            return {"tiene_viaje": False}

        return {
            "tiene_viaje": True,
            "viaje": {
                "id": actual.id,
                "estado": actual.estado,
                "tarifa": actual.tarifa,
                "origen": actual.origen,
                "destino": actual.destino,
                "tiempo_espera": actual.tiempo_espera(),
                "duracion": actual.duracion(),
            }
        }

    def estado_taxi(self, taxi_id: int) -> Dict:
        with self.sem_taxis:
            taxi = self.taxis.get(taxi_id)
        if not taxi:
            return {"existe": False}

        return {
            "existe": True,
            "ocupado": taxi.ocupado,
            "x": taxi.x,
            "y": taxi.y,
            "rating": taxi.rating,
            "ganancias_dia": taxi.ganancias_dia
        }

    def resumen_sistema(self) -> Dict:
        with self.sem_taxis:
            taxis = list(self.taxis.values())
        with self.sem_viajes:
            viajes = list(self.viajes.values())
        with self._lock_metrics:
            avg_espera = (self.total_espera / self.total_espera_count) if self.total_espera_count > 0 else 0.0

        num_ocupados = sum(1 for t in taxis if t.ocupado)
        num_libres = len(taxis) - num_ocupados

        return {
            "num_taxis": len(taxis),
            "taxis_ocupados": num_ocupados,
            "taxis_libres": num_libres,
            "num_viajes": len(viajes),
            "num_viajes_finalizados": sum(1 for v in viajes if v.estado == "finalizado"),
            "ganancias_empresa_dia": self.ganancias_empresa_dia,
            "ganancias_empresa_mes": self.ganancias_empresa_mes,
            "tiempo_medio_espera": avg_espera
        }
