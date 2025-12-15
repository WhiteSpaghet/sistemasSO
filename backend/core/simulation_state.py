# backend/core/simulation_state.py
from .clock import SimulatedClock
from .dispatcher import Dispatcher
from .scenarios import ScenarioManager
import config as cfg


# Instancias globales (singletons simples)
clock = SimulatedClock()
dispatcher = Dispatcher(clock)
scenario_manager = ScenarioManager(dispatcher, clock)
