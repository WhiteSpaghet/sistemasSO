# backend/core/clock.py
import time
from datetime import datetime, timedelta
from . import models  # para que el paquete sea reconocido
import config as cfg


class SimulatedClock:
    """
    Reloj simulado: 5 min reales = 24h simuladas.
    """
    def __init__(self):
        self.start_real = time.time()
        # Día base arbitrario para la simulación
        self.start_sim = datetime(2025, 1, 1, 0, 0, 0)
        self.sim_minutes_per_real_second = cfg.SIM_MINUTES_PER_REAL_SECOND

    def now(self) -> datetime:
        elapsed_real = time.time() - self.start_real
        elapsed_sim_minutes = elapsed_real * self.sim_minutes_per_real_second
        return self.start_sim + timedelta(minutes=elapsed_sim_minutes)

    def to_str(self) -> str:
        return self.now().strftime("%Y-%m-%d %H:%M:%S")
