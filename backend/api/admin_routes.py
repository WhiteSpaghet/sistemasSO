# backend/api/admin_routes.py
from flask import Blueprint, request, jsonify
from core.simulation_state import scenario_manager

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/escenario", methods=["POST"])
def configurar_escenario():
    data = request.json
    num_taxis = int(data.get("numTaxis", 3))
    num_clientes = int(data.get("numClientes", 10))
    tasa = float(data.get("tasaLlegadasPorMinSim", 2.0))

    scenario_manager.start_scenario(num_taxis, num_clientes, tasa)
    return jsonify({"ok": True, "mensaje": "Escenario iniciado"})


@admin_bp.route("/metricas", methods=["GET"])
def metricas():
    m = scenario_manager.metricas_admin()
    return jsonify(m)


@admin_bp.route("/stop", methods=["POST"])
def stop():
    scenario_manager.stop_scenario()
    return jsonify({"ok": True})
