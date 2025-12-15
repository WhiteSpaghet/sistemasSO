/*
  Archivo: frontend/src/App.jsx
  - Copia todo este archivo y pégalo sobre frontend/src/App.jsx en tu proyecto (o guarda directamente como App.jsx)
  - Después reinicia el frontend: npm run dev

  Qué hace:
  - Mejora el diseño con tarjetas y layout moderno (sin depender de Tailwind)
  - Carga periódicamente /api/status/resumen
  - Formatea cantidades con redondeo a 2 decimales + Intl.NumberFormat para evitar «10.0000000000002 €»

*/

import React, { useEffect, useState } from "react";

function formatMoney(v) {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  const rounded = Math.round(n * 100) / 100; // evita errores de punto flotante
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(rounded);
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchResumen() {
      try {
        const res = await fetch("http://localhost:5000/api/status/resumen");
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(String(e));
          setLoading(false);
        }
      }
    }
    fetchResumen();
    const it = setInterval(fetchResumen, 2000);
    return () => {
      mounted = false;
      clearInterval(it);
    };
  }, []);

  return (
    <div style={rootStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Simulación de Taxis</h1>
          <div style={{ color: "#666", fontSize: 13 }}>Panel de control</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#555" }}>Estado: <strong style={{ color: navigator.onLine ? "#157EFB" : "#E53935" }}>{navigator.onLine ? 'Online' : 'Offline'}</strong></div>
        </div>
      </header>

      <main>
        <div style={gridStyle}>
          <Card title="Resumen" subtitle={loading ? 'Cargando...' : error ? 'Error' : 'Última actualización'}>
            {loading && <div>Obteniendo datos…</div>}
            {error && <div style={{ color: 'crimson' }}>{error}</div>}
            {data && (
              <div style={{ display: 'grid', gap: 10 }}>
                {Object.keys(data).map((k) => {
                  const v = data[k];
                  const isNumber = typeof v === "number" || (!Number.isNaN(Number(v)) && v !== "");
                  const lower = k.toLowerCase();
                  const display = (lower.includes('dinero') || lower.includes('importe') || lower.includes('euros') || (isNumber && String(v).includes('.')))
                    ? formatMoney(v)
                    : (isNumber ? new Intl.NumberFormat('es-ES').format(Number(v)) : String(v));

                  return (
                    <div key={k} style={kvStyle}>
                      <div style={{ color: '#444' }}>{beautifyKey(k)}</div>
                      <div style={{ fontWeight: 700 }}>{display}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card title="Indicadores rápidos">
            <div style={{ display: 'grid', gap: 10 }}>
              <Mini label="Clientes" value={data?.clientes ?? 0} />
              <Mini label="Taxis" value={data?.taxis ?? 0} />
              <Mini label="Facturación" value={formatMoney(data?.facturacion_total ?? 0)} />
              <Mini label="Viajes pendientes" value={data?.viajes_pendientes ?? 0} />
            </div>
          </Card>
        </div>

        <section style={{ marginTop: 18 }}>
          <h2 style={{ fontSize: 16, margin: '6px 0' }}>JSON (datos crudos)</h2>
          <pre style={preStyle}>{data ? JSON.stringify(data, null, 2) : '—'}</pre>
        </section>
      </main>

      <footer style={{ marginTop: 20, color: '#888', fontSize: 13 }}>Diseñado para ser limpio y legible • Puedes personalizar colores y tipografías</footer>
    </div>
  );
}

function beautifyKey(k) {
  return String(k).replace(/[_\-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function Card({ title, subtitle, children }) {
  return (
    <div style={{ background: '#fff', padding: 14, borderRadius: 12, boxShadow: '0 8px 24px rgba(12,15,20,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: 13, color: '#666' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#999' }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div style={{ background: '#f7f9fc', padding: 10, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ color: '#666', fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const rootStyle = { fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', padding: 20, background: '#f5f7fb', minHeight: '100vh' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 };
const kvStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(12,15,20,0.03)' };
const preStyle = { background: '#fff', padding: 12, borderRadius: 8, maxHeight: 300, overflow: 'auto', boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)' };
