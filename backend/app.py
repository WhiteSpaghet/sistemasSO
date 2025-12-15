# backend/app.py
from flask import Flask
from flask_cors import CORS

from api.cliente_routes import cliente_bp
from api.taxi_routes import taxi_bp
from api.admin_routes import admin_bp
from api.status_routes import status_bp

# Importar simulation_state para inicializar clock/dispatcher/escenarios
import core.simulation_state  # noqa

app = Flask(__name__)
CORS(app)

app.register_blueprint(cliente_bp, url_prefix="/api/cliente")
app.register_blueprint(taxi_bp, url_prefix="/api/taxi")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(status_bp, url_prefix="/api/status")


if __name__ == "__main__":
    app.run(debug=True)
