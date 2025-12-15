// frontend/src/App.jsx
// Tema: oscuro
// Reemplaza frontend/src/App.jsx con este contenido

import React, { useEffect, useState } from 'react';
import AdminPage from './pages/AdminPage';
import ClientePage from './pages/ClientePage';
import TaxiPage from './pages/TaxiPage';

// FORMATEO DE DINERO: redondea de forma segura y retorna string con 2 decimales
export function formatMoney(v) {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  // Redondeo estable: evita errores de punto flotante y fuerza 2 decimales
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
  // Aseguramos que el valor muestre exactamente 2 decimales usando toFixed
  // pero no como valor final: toFixed puede devolver "11.90"; Intl formatea correctamente
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(rounded);
}

const ROLES = [
  { id: 'cliente', label: 'Cliente', color: '#FF8A65' },
  { id: 'taxi', label: 'Taxista', color: '#26A69A' },
  { id: 'admin', label: 'Admin', color: '#7E57C2' }
];

export default function App() {
  const [role, setRole] = useState('cliente');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchResumen() {
      try {
        const res = await fetch('http://localhost:5000/api/status/resumen');
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
    const it = setInterval(fetchResumen, 2500);
    return () => {
      mounted = false;
      clearInterval(it);
    };
  }, []);

  const accent = ROLES.find(r => r.id === role)?.color || '#157EFB';

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial', minHeight: '100vh', background: '#0b0b0d', color: '#EEE', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Simulación de Taxis</h1>
          <div style={{ color: '#AAA', fontSize: 13 }}>Gestión · Monitorización · Pruebas</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RoleSelector role={role} setRole={setRole} />
          <div style={{ padding: '6px 10px', borderRadius: 8, background: '#0f1720', boxShadow: '0 6px 18px rgba(0,0,0,0.6)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: 6, background: accent }} />
            <div style={{ fontSize: 13, color: '#EEE' }}>{ROLES.find(r => r.id === role)?.label}</div>
          </div>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 18 }}>
        <aside>
          <div style={{ position: 'sticky', top: 20 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#AAA' }}>Resumen del sistema</div>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: accent }}>{loading ? 'Cargando…' : formatMoney(data?.facturacion_total ?? 0)}</div>
                  <div style={{ color: '#999', fontSize: 12, marginTop: 6 }}>Facturación total</div>
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                <Mini label="Clientes" value={data?.clientes ?? '—'} />
                <Mini label="Taxis" value={data?.taxis ?? '—'} />
                <Mini label="Viajes pendientes" value={data?.viajes_pendientes ?? '—'} />
                <Mini label="Ingresos (hoy)" value={formatMoney(data?.ingresos_hoy ?? 0)} />
              </div>
            </Card>

            <Card style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: '#AAA' }}>Acciones rápidas</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setRole('cliente')} className="accent-btn" style={{ flex: 1 }}>Ver como cliente</button>
                <button onClick={() => setRole('taxi')} className="accent-btn" style={{ flex: 1 }}>Ver como taxista</button>
              </div>
            </Card>

            <Card style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: '#AAA' }}>Datos crudos</div>
              <pre style={{ marginTop: 8, maxHeight: 220, overflow: 'auto', background: '#071018', padding: 10, borderRadius: 8, color: '#DDD' }}>{data ? JSON.stringify(data, null, 2) : '—'}</pre>
            </Card>
          </div>
        </aside>

        <section>
          <div style={{ background: '#071018', padding: 16, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{ROLES.find(r => r.id === role)?.label}</h2>
              <div style={{ color: '#888', fontSize: 13 }}>{loading ? 'Sincronizando…' : 'Actualizado'}</div>
            </div>

            <div style={{ minHeight: 320 }}>
              {role === 'admin' && <AdminPage accent={accent} formatMoney={formatMoney} />}
              {role === 'taxi' && <TaxiPage accent={accent} formatMoney={formatMoney} />}
              {role === 'cliente' && <ClientePage accent={accent} formatMoney={formatMoney} />}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ marginTop: 18, color: '#777', fontSize: 13, textAlign: 'center' }}>Simulación · Interfaz (tema oscuro) — dime si quieres iconos o tema alternativo.</footer>

      {/* Estilos globales en línea para botones (no depende de CSS externo) */}
      <style>{`
        .accent-btn{ background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.06); color: #EEE; padding: 8px 10px; border-radius: 8px; font-weight:700; cursor:pointer; }
        .accent-btn:hover{ transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.6); }
        button[aria-pressed="true"]{ outline: none; }
        /* Role selector button overrides to give visible backgrounds */
        .role-btn{ padding:8px 12px; border-radius:10px; border:none; font-weight:700; cursor:pointer }
      `}</style>
    </div>
  );
}

function RoleSelector({ role, setRole }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {ROLES.map(r => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          aria-pressed={role === r.id}
          className="role-btn"
          style={{
            background: role === r.id ? r.color : 'transparent',
            color: role === r.id ? '#0b0b0d' : '#DDD',
            boxShadow: role === r.id ? '0 8px 24px rgba(12,15,20,0.5)' : 'none'
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: '#071018', padding: 14, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.6)', ...style }}>
      {children}
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: '#08121a' }}>
      <div style={{ color: '#AAA', fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 700, color: '#FFF' }}>{typeof value === 'number' ? formatMoney(value) : value}</div>
    </div>
  );
}
