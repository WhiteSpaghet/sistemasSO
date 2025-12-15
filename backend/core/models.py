# backend/core/models.py
from dataclasses import dataclass, field
from typing import Tuple, Optional
import threading
import time


@dataclass
class Taxi:
    id: int
    marca: str
    modelo: str
    placa: str
    x: float
    y: float
    rating: float = 5.0
    ocupado: bool = False
    ganancias_dia: float = 0.0

    # semáforo binario para este taxi
    sem: threading.Semaphore = field(default_factory=lambda: threading.Semaphore(1))


@dataclass
class Cliente:
    id: int
    nombre: str
    tarjeta_enmascarada: str
    x: float
    y: float


@dataclass
class Viaje:
    id: int
    cliente_id: int
    taxi_id: int
    origen: Tuple[float, float]
    destino: Tuple[float, float]
    tarifa: float
    estado: str       # "pendiente", "en_curso", "finalizado"
    hora_solicitud: float
    hora_asignacion: Optional[float] = None
    hora_fin: Optional[float] = None
    rating_cliente: Optional[int] = None
    rating_taxi: Optional[int] = None

    def tiempo_espera(self) -> Optional[float]:
        if self.hora_asignacion is None:
            return None
        return self.hora_asignacion - self.hora_solicitud

    def duracion(self) -> Optional[float]:
        if self.hora_fin is None or self.hora_asignacion is None:
            return None
        return self.hora_fin - self.hora_asignacion
