# backend/api/cliente_routes.py
from flask import Blueprint, request, jsonify
from core.simulation_state import dispatcher
from core.models import Cliente

cliente_bp = Blueprint("cliente", __name__)


@cliente_bp.route("/registrar", methods=["POST"])
def registrar_cliente():
    data = request.json
    cid = int(data.get("id", 1))
    nombre = data.get("nombre", f"Cliente{cid}")
    tarjeta = data.get("tarjeta", "****-****-****-1234")
    x = float(data.get("x", 0.0))
    y = float(data.get("y", 0.0))

    cliente = Cliente(id=cid, nombre=nombre, tarjeta_enmascarada=tarjeta, x=x, y=y)
    dispatcher.registrar_cliente(cliente)
    return jsonify({"ok": True, "cliente_id": cid})


@cliente_bp.route("/solicitar", methods=["POST"])
def solicitar_viaje():
    data = request.json
    cliente_id = int(data["clienteId"])
    origen_x = float(data["origen"]["x"])
    origen_y = float(data["origen"]["y"])
    dest_x = float(data["destino"]["x"])
    dest_y = float(data["destino"]["y"])

    # actualizar posición cliente
    with dispatcher.sem_clientes:
        cliente = dispatcher.clientes.get(cliente_id)
        if not cliente:
            # si no existe lo creamos rápido
            cliente = Cliente(
                id=cliente_id,
                nombre=f"Cliente{cliente_id}",
                tarjeta_enmascarada="****-****-****-1234",
                x=origen_x,
                y=origen_y
            )
            dispatcher.clientes[cliente_id] = cliente
        else:
            cliente.x = origen_x
            cliente.y = origen_y

    viaje_id = dispatcher.solicitar_viaje(cliente_id, (dest_x, dest_y))
    if viaje_id is None:
        return jsonify({"ok": False, "error": "No se pudo crear el viaje"}), 400

    return jsonify({"ok": True, "viajeId": viaje_id})


@cliente_bp.route("/estado/<int:cliente_id>", methods=["GET"])
def estado_cliente(cliente_id: int):
    estado = dispatcher.estado_cliente(cliente_id)
    return jsonify(estado)
