// frontend/src/App.jsx
// Interfaz estética mejorada (tema oscuro pulido)
// - Mejora tipográfica, espaciado y jerarquía visual
// - Botones con fondo, sombras y microinteracciones
// - Pestañas de rol con iconos SVG y estado activo claramente marcado
// - Tarjetas con borde sutil, degradados y sombra profunda
// - Todos los importes pasan por formatMoney para evitar artefactos de punto flotante
// Reemplaza tu frontend/src/App.jsx con este archivo y reinicia el front (npm run dev)

import React, { useEffect, useState } from 'react';
import AdminPage from './pages/AdminPage';
import ClientePage from './pages/ClientePage';
import TaxiPage from './pages/TaxiPage';

export function formatMoney(v) {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(rounded);
}

const ROLES = [
  { id: 'cliente', label: 'Cliente', color: '#FF7A59', icon: 'M12 2a2 2 0 110 4 2 2 0 010-4zM6.5 6.5A3.5 3.5 0 1010 10a3.5 3.5 0 00-3.5-3.5zM4 14s1-1 6-1 6 1 6 1v3H4v-3z' },
  { id: 'taxi', label: 'Taxista', color: '#26C6AA', icon: 'M3 13h18v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM5 8h14l1 3H4l1-3zM7 5h2v2H7V5z' },
  { id: 'admin', label: 'Admin', color: '#7C5CFF', icon: 'M12 8a4 4 0 100 8 4 4 0 000-8zM2 12a10 10 0 1120 0A10 10 0 012 12z' }
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
    return () => { mounted = false; clearInterval(it); };
  }, []);

  const accent = ROLES.find(r => r.id === role)?.color || '#157EFB';

  return (
    <div className="app-root">
      <Header accent={accent} role={role} setRole={setRole} />

      <main className="layout">
        <aside className="sidebar">
          <Card className="summary-card">
            <div className="summary-top">
              <div>
                <div className="muted">Resumen del sistema</div>
                <div className="big-title">{loading ? 'Cargando…' : formatMoney(data?.facturacion_total ?? 0)}</div>
                <div className="muted small">Facturación total</div>
              </div>
              <div className="logo-pill" style={{ borderColor: accent }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke={accent} strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>

            <div className="stats-grid">
              <Stat label="Clientes" value={data?.clientes ?? '—'} />
              <Stat label="Taxis" value={data?.taxis ?? '—'} />
              <Stat label="Viajes pendientes" value={data?.viajes_pendientes ?? '—'} />
              <Stat label="Ingresos (hoy)" value={formatMoney(data?.ingresos_hoy ?? 0)} />
            </div>

            <div className="actions">
              <button className="primary" onClick={() => setRole('cliente')}>Ver como cliente</button>
              <button className="ghost" onClick={() => setRole('taxi')}>Ver como taxista</button>
            </div>
          </Card>

          <Card className="raw-card">
            <div className="muted">Datos crudos</div>
            <pre className="raw-pre">{data ? JSON.stringify(data, null, 2) : '—'}</pre>
          </Card>
        </aside>

        <section className="content">
          <div className="content-top">
            <h2 className="page-title">{ROLES.find(r => r.id === role)?.label}</h2>
            <div className="status">{loading ? 'Sincronizando…' : 'Últimos datos'}</div>
          </div>

          <div className="panel">
            {role === 'admin' && <AdminPage accent={accent} formatMoney={formatMoney} />}
            {role === 'taxi' && <TaxiPage accent={accent} formatMoney={formatMoney} />}
            {role === 'cliente' && <ClientePage accent={accent} formatMoney={formatMoney} />}
          </div>
        </section>
      </main>

      <footer className="footer">Simulación • Interfaz mejorada — prensa «r» para recargar datos manualmente</footer>

      <style>{`
        :root{ --bg:#060608; --panel:#071018; --muted:#9aa3b2; --glass: rgba(255,255,255,0.03); }
        *{ box-sizing: border-box; }
        .app-root{ background: linear-gradient(180deg,#050507 0%, #0b0b0d 100%); min-height:100vh; color:#EEF2F6; font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:24px; }
        header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:18px }
        .brand{ display:flex; gap:12px; align-items:center }
        .brand h1{ margin:0; font-size:20px; letter-spacing:-0.2px }
        .brand p{ margin:0; color:var(--muted); font-size:13px }

        .layout{ display:grid; grid-template-columns: 360px 1fr; gap:20px }
        .sidebar{ position:relative }
        .card{ background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:14px; padding:14px; box-shadow: 0 8px 30px rgba(0,0,0,0.7); border:1px solid rgba(255,255,255,0.03); }
        .summary-card .summary-top{ display:flex; justify-content:space-between; align-items:flex-start }
        .muted{ color:var(--muted) }
        .big-title{ font-size:22px; font-weight:800; margin-top:8px }
        .small{ font-size:12px }
        .logo-pill{ width:48px; height:48px; border-radius:10px; display:flex; align-items:center; justify-content:center; border:2px solid; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); }

        .stats-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px }
        .stat{ background: linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01)); border-radius:10px; padding:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(255,255,255,0.025) }
        .stat .label{ color:var(--muted); font-size:13px }
        .stat .val{ font-weight:800 }

        .actions{ display:flex; gap:8px; margin-top:12px }
        .primary{ flex:1; padding:10px 12px; border-radius:10px; border:none; background: linear-gradient(180deg, ${accent}, rgba(0,0,0,0.12)); color:#071018; font-weight:800; cursor:pointer; box-shadow: 0 8px 24px rgba(124,92,255,0.12); }
        .ghost{ flex:1; padding:10px 12px; border-radius:10px; border:1px solid rgba(255,255,255,0.04); background:transparent; color:#EEE; font-weight:700; cursor:pointer }

        .raw-card .raw-pre{ background:#041018; padding:10px; border-radius:8px; color:#CFE7FF }

        .content{ min-height:400px }
        .content-top{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px }
        .page-title{ margin:0; font-size:18px }
        .panel{ background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00)); padding:12px; border-radius:12px }

        .footer{ text-align:center; color:var(--muted); margin-top:18px }

        /* Role selector styling */
        .role-row{ display:flex; gap:8px }
        .role-btn{ padding:8px 12px; border-radius:12px; border:none; font-weight:700; cursor:pointer; display:inline-flex; gap:8px; align-items:center }
        .role-btn svg{ opacity:0.9 }
        .role-btn.active{ color:#071018; box-shadow: 0 10px 28px rgba(0,0,0,0.6); }

        /* small responsive */
        @media (max-width:980px){ .layout{ grid-template-columns: 1fr; } .sidebar{ order:2 } .content{ order:1 } }
      `}</style>
    </div>
  );
}

function Header({ accent, role, setRole }){
  return (
    <header>
      <div className="brand">
        <div style={{ width:44, height:44, borderRadius:10, background: 'linear-gradient(135deg,'+accent+', rgba(255,255,255,0.02))', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </div>
        <div>
          <h1>Simulación de Taxis</h1>
          <p>Gestión · Monitorización</p>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div className="role-row">
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} className={`role-btn ${role===r.id? 'active':''}`} style={{ background: role===r.id ? r.color : 'transparent', color: role===r.id ? '#071018' : '#DDD' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={role===r.id ? '#071018' : 'none'} xmlns="http://www.w3.org/2000/svg"><path d={r.icon} fill={role===r.id ? '#071018' : 'none'} stroke={role===r.id ? 'none' : '#DDD'} strokeWidth="0.8"/></svg>
              {r.label}
            </button>
          ))}
        </div>

        <div style={{ padding:'6px 10px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)' }}>
          <small style={{ color:'#BBB' }}>{role.toUpperCase()}</small>
        </div>
      </div>
    </header>
  );
}

function Card({ children, className='' }){
  return <div className={`card ${className}`}>{children}</div>;
}

function Stat({ label, value }){
  const isNum = typeof value === 'number' || (!Number.isNaN(Number(value)) && value !== '—');
  return (
    <div className="stat">
      <div>
        <div className="label">{label}</div>
      </div>
      <div className="val">{isNum && typeof value === 'number' ? formatMoney(value) : value}</div>
    </div>
  );
}
