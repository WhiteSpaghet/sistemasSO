// frontend/src/App.jsx
// Reemplaza tu frontend/src/App.jsx por este archivo y reinicia el frontend (npm run dev).
// Funcionalidades añadidas:
// - Selector de rol: Taxi / Cliente / Admin (como pestañas en la parte superior)
// - Cada rol tiene color de acento
// - Layout con tarjeta resumen a la izquierda y contenido de rol a la derecha
// - Formato seguro de dinero (evita 10.0000000000002 €)
// - Estilos modernos y responsivos sin depender de librerías externas

import React, { useEffect, useState } from 'react';
import AdminPage from './pages/AdminPage';
import ClientePage from './pages/ClientePage';
import TaxiPage from './pages/TaxiPage';

function formatMoney(v) {
  if (v === null || v === undefined) return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100; // evitar errores de punto flotante
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(rounded);
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
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial', minHeight: '100vh', background: '#F4F7FB', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Simulación de Taxis</h1>
          <div style={{ color: '#666', fontSize: 13 }}>Gestión · Monitorización · Pruebas</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RoleSelector role={role} setRole={setRole} />
          <div style={{ padding: '6px 10px', borderRadius: 8, background: '#fff', boxShadow: '0 4px 14px rgba(12,15,20,0.06)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: 6, background: accent }} />
            <div style={{ fontSize: 13, color: '#333' }}>{ROLES.find(r => r.id === role)?.label}</div>
          </div>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 18 }}>
        <aside>
          <div style={{ position: 'sticky', top: 20 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#666' }}>Resumen del sistema</div>
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
              <div style={{ fontSize: 13, color: '#666' }}>Acciones rápidas</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setRole('cliente')} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', background: '#E9F5FF', color: '#0B63D6', fontWeight: 700 }}>Ver como cliente</button>
                <button onClick={() => setRole('taxi')} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', background: '#E8F8F5', color: '#007A66', fontWeight: 700 }}>Ver como taxista</button>
              </div>
            </Card>

            <Card style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: '#666' }}>Datos crudos</div>
              <pre style={{ marginTop: 8, maxHeight: 220, overflow: 'auto', background: '#fff', padding: 10, borderRadius: 8 }}>{data ? JSON.stringify(data, null, 2) : '—'}</pre>
            </Card>
          </div>
        </aside>

        <section>
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 10px 30px rgba(12,15,20,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{ROLES.find(r => r.id === role)?.label}</h2>
              <div style={{ color: '#888', fontSize: 13 }}>{loading ? 'Sincronizando…' : 'Actualizado'}</div>
            </div>

            <div style={{ minHeight: 320 }}>
              {/* Renderizamos la página correspondiente al rol */}
              {role === 'admin' && <AdminPage accent={accent} />}
              {role === 'taxi' && <TaxiPage accent={accent} />}
              {role === 'cliente' && <ClientePage accent={accent} />}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ marginTop: 18, color: '#888', fontSize: 13, textAlign: 'center' }}>Simulación · Interfaz mejorada — si quieres, puedo añadir iconos o un tema oscuro.</footer>
    </div>
  );
}

function RoleSelector({ role, setRole }) {
  return (
    <div style={{ display: 'flex', gap: 8, background: 'transparent' }}>
      {ROLES.map(r => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          aria-pressed={role === r.id}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            border: '1px solid transparent',
            background: role === r.id ? r.color : 'rgba(255,255,255,0.9)',
            color: role === r.id ? '#fff' : '#333',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: role === r.id ? '0 6px 18px rgba(12,15,20,0.08)' : 'none'
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
    <div style={{ background: '#fff', padding: 14, borderRadius: 12, boxShadow: '0 8px 24px rgba(12,15,20,0.04)', ...style }}>
      {children}
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: '#F7FAFC' }}>
      <div style={{ color: '#666', fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
