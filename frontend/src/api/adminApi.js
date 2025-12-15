// frontend/src/api/adminApi.js
const BASE = "http://localhost:5000/api";

export async function iniciarEscenario(numTaxis, numClientes, tasaLlegadasPorMinSim) {
  const res = await fetch(`${BASE}/admin/escenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numTaxis, numClientes, tasaLlegadasPorMinSim }),
  });
  return res.json();
}

export async function pararEscenario() {
  const res = await fetch(`${BASE}/admin/stop`, {
    method: "POST",
  });
  return res.json();
}

export async function getMetricas() {
  const res = await fetch(`${BASE}/admin/metricas`);
  return res.json();
}
