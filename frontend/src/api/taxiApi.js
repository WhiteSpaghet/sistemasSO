// frontend/src/api/taxiApi.js
const BASE = "http://localhost:5000/api";

export async function getEstadoTaxi(taxiId) {
  const res = await fetch(`${BASE}/taxi/estado/${taxiId}`);
  return res.json();
}
