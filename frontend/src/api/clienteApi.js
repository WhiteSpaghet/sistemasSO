// frontend/src/api/clienteApi.js
const BASE = "http://localhost:5000/api";

export async function solicitarViaje(clienteId, origen, destino) {
  const res = await fetch(`${BASE}/cliente/solicitar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, origen, destino }),
  });
  return res.json();
}

export async function getEstadoCliente(clienteId) {
  const res = await fetch(`${BASE}/cliente/estado/${clienteId}`);
  return res.json();
}
