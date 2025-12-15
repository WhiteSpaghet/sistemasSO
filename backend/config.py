# backend/config.py

# Ratio de tiempo: 5 minutos reales = 24h simuladas
REAL_SECONDS_PER_SIM_DAY = 300.0  # 5 minutos
SIM_MINUTES_PER_REAL_SECOND = 1440.0 / REAL_SECONDS_PER_SIM_DAY

# Radio de búsqueda de taxi en km
RADIO_BUSQUEDA_KM = 2.0

# Comisión empresa UNIETAXI
COMISION_EMPRESA = 0.20  # 20%

# Parámetros por defecto de escenarios admin
DEFAULT_NUM_TAXIS = 3
DEFAULT_NUM_CLIENTES = 10
DEFAULT_TASA_LLEGADAS_POR_MIN_SIM = 2.0  # clientes/minuto sim
