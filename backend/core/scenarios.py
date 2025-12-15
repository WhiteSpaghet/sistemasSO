# backend/core/scenarios.py
import random
import threading
import time
from typing import Optional

from .dispatcher import Dispatcher
from .models import Taxi, Cliente
from .clock import SimulatedClock
from backend import config as cfg


class TaxiThread(threading.Thread):
    """
    Hilo que representa un taxi.
    Toma viajes de su cola y los ejecuta.
    """

    def __init__(self, taxi: Taxi, dispatcher: Dispatcher, clock: SimulatedClock):
        super().__init__(daemon=True)
        self.taxi = taxi
        self.dispatcher = dispatcher
        self.clock = clock

    def run(self):
        while True:
            viaje = self.dispatcher.tomar_viaje_taxi(self.taxi.id)
            if not viaje:
                continue

            # Simulamos trayecto:
            # distancia en "km", la convertimos a segundos reales usando la escala
            dist = ((viaje.origen[0] - viaje.destino[0]) ** 2 + (viaje.origen[1] - viaje.destino[1]) ** 2) ** 0.5
            # Por ejemplo: 1 km simulado -> 5 min simulados = 5 / 4.8 ~ 1.04 s reales
            segundos_reales = max(1.0, dist)  # simple, para no complicar
            time.sleep(segundos_reales)

            # Actualizar posición del taxi al destino
            self.taxi.x, self.taxi.y = viaje.destino

            # Finalizamos viaje
            self.dispatcher.finalizar_viaje(viaje.id)


class ScenarioManager:
    """
    Modo admin: escenarios de concurrencia
    - Genera taxis y clientes
    - Dispara llegadas de clientes según una tasa de llegada
    - Hilo de cierre diario contable
    """

    def __init__(self, dispatcher: Dispatcher, clock: SimulatedClock):
        self.dispatcher = dispatcher
        self.clock = clock

        self._scenario_thread: Optional[threading.Thread] = None
        self._stop_scenario = threading.Event()

        # Hilo de cierre diario
        self._hilo_cierre = threading.Thread(target=self._loop_cierre_diario, daemon=True)
        self._hilo_cierre.start()

    def _loop_cierre_diario(self):
        while True:
            time.sleep(1.0)
            self.dispatcher.cierre_diario_si_corresponde()

    def start_scenario(self, num_taxis: int, num_clientes: int, tasa_llegadas_por_min_sim: float):
        """
        Lanza un escenario: se generan taxis y clientes
        y se crean solicitudes de viaje de clientes según una tasa.
        """
        # parar escenario anterior si existe
        self.stop_scenario()

        # poblar taxis si hace falta
        for i in range(1, num_taxis + 1):
            taxi = Taxi(
                id=i,
                marca="MarcaX",
                modelo="ModeloY",
                placa=f"UNI-{i:03d}",
                x=random.uniform(0, 10),
                y=random.uniform(0, 10),
            )
            self.dispatcher.registrar_taxi(taxi)
            hilo_taxi = TaxiThread(taxi, self.dispatcher, self.clock)
            hilo_taxi.start()

        # poblar clientes
        for j in range(1, num_clientes + 1):
            cli = Cliente(
                id=j,
                nombre=f"Cliente{j}",
                tarjeta_enmascarada="****-****-****-1234",
                x=random.uniform(0, 10),
                y=random.uniform(0, 10),
            )
            self.dispatcher.registrar_cliente(cli)

        # lanzar hilo que genere solicitudes de clientes
        self._stop_scenario.clear()
        self._scenario_thread = threading.Thread(
            target=self._loop_generar_solicitudes,
            args=(num_clientes, tasa_llegadas_por_min_sim),
            daemon=True
        )
        self._scenario_thread.start()

    def stop_scenario(self):
        if self._scenario_thread and self._scenario_thread.is_alive():
            self._stop_scenario.set()
            self._scenario_thread.join(timeout=1.0)

    def _loop_generar_solicitudes(self, num_clientes: int, tasa_llegadas_por_min_sim: float):
        """
        Genera solicitudes de viaje.
        tasa_llegadas_por_min_sim = nº de clientes/minuto simulado.
        """
        # minutos simulados por segundo real ya lo tenemos en clock
        # 1 minuto sim = 1 / SIM_MINUTES_PER_REAL_SECOND segundos reales
        if tasa_llegadas_por_min_sim <= 0:
            tasa_llegadas_por_min_sim = 1.0

        # tiempo real entre llegadas:
        # (1 / tasa_llegadas_por_min_sim) minutos sim / (SIM_MINUTES_PER_REAL_SECOND min_sim/seg_real)
        segundos_reales_entre_llegadas = (1.0 / tasa_llegadas_por_min_sim) / cfg.SIM_MINUTES_PER_REAL_SECOND

        while not self._stop_scenario.is_set():
            # elegir cliente aleatorio
            cliente_id = random.randint(1, num_clientes)
            # destino aleatorio
            destino = (random.uniform(0, 10), random.uniform(0, 10))
            # lanzar solicitud (bloquea hasta conseguir taxi)
            self.dispatcher.solicitar_viaje(cliente_id, destino)

            time.sleep(max(0.1, segundos_reales_entre_llegadas))

    def metricas_admin(self):
        """
        Devuelve métricas útiles para el panel admin.
        """
        return self.dispatcher.resumen_sistema()
