// frontend/src/api/statusApi.js
const BASE = "http://localhost:5000/api";

export async function getClock() {
  const res = await fetch(`${BASE}/status/clock`);
  return res.json();
}

export async function getResumen() {
  const res = await fetch(`${BASE}/status/resumen`);
  return res.json();
}
