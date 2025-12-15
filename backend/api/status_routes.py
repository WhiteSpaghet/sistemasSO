# backend/api/status_routes.py
from flask import Blueprint, jsonify
from core.simulation_state import clock, dispatcher

status_bp = Blueprint("status", __name__)


@status_bp.route("/clock", methods=["GET"])
def clock_endpoint():
    return jsonify({"hora": clock.to_str()})


@status_bp.route("/resumen", methods=["GET"])
def resumen():
    return jsonify(dispatcher.resumen_sistema())
