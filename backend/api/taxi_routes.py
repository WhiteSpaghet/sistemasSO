# backend/api/taxi_routes.py
from flask import Blueprint, jsonify, request
from core.simulation_state import dispatcher
from core.models import Taxi

taxi_bp = Blueprint("taxi", __name__)


@taxi_bp.route("/registrar", methods=["POST"])
def registrar_taxi():
    data = request.json
    tid = int(data["id"])
    marca = data.get("marca", "MarcaX")
    modelo = data.get("modelo", "ModeloY")
    placa = data.get("placa", f"UNI-{tid:03d}")
    x = float(data.get("x", 0.0))
    y = float(data.get("y", 0.0))

    taxi = Taxi(id=tid, marca=marca, modelo=modelo, placa=placa, x=x, y=y)
    dispatcher.registrar_taxi(taxi)
    return jsonify({"ok": True, "taxi_id": tid})


@taxi_bp.route("/estado/<int:taxi_id>", methods=["GET"])
def estado_taxi(taxi_id: int):
    estado = dispatcher.estado_taxi(taxi_id)
    return jsonify(estado)
