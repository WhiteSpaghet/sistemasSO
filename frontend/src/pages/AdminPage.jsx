export function AdminPage({ accent = '#7C5CFF', formatMoney = (v) => String(v) }) {
const gananciasCandidates = (r) => {
if(!r) return 0;
return (
r.ganancias_empresa_dia ?? r.ganancias_empresa ?? r.ingresos_hoy ?? r.facturacion_dia ?? r.facturacion_total ?? 0
);
};


return (
<div style={{ color:'#E9F0F6' }}>
<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
<div style={panelStyle}>
<div style={{ fontSize:13, color:'#AAB4C1' }}>Ganancias empresa (día)</div>
<div style={{ fontSize:20, fontWeight:800, color:accent, marginTop:6 }}>{loading ? '—' : formatMoney(gananciasCandidates(resumen))}</div>
<div style={{ marginTop:8, color:'#98A3B0', fontSize:13 }}>Suma de ingresos útiles para la empresa (actual)</div>
</div>


<div style={panelStyle}>
<div style={{ fontSize:13, color:'#AAB4C1' }}>Viajes totales (simulación)</div>
<div style={{ fontSize:20, fontWeight:800, marginTop:6 }}>{loading ? '—' : (resumen?.viajes_totales ?? resumen?.viajes_realizados ?? '—')}</div>
<div style={{ marginTop:8, color:'#98A3B0', fontSize:13 }}>Contador acumulado</div>
</div>
</div>


<div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
<div style={cardSmallStyle}>
<div style={{ color:'#AAB4C1', fontSize:13 }}>Clientes</div>
<div style={{ fontWeight:800, marginTop:6 }}>{resumen?.clientes ?? '—'}</div>
</div>
<div style={cardSmallStyle}>
<div style={{ color:'#AAB4C1', fontSize:13 }}>Taxis</div>
<div style={{ fontWeight:800, marginTop:6 }}>{resumen?.taxis ?? '—'}</div>
</div>
</div>


<div style={{ marginTop:16 }}>
<h3 style={{ margin:0, marginBottom:8 }}>Detalles</h3>
{error && <div style={{ color:'salmon' }}>{error}</div>}
<div style={{ background:'#041018', padding:12, borderRadius:10, color:'#DDEBF8' }}>
<pre style={{ margin:0, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{resumen ? JSON.stringify(resumen, null, 2) : (loading ? 'Cargando…' : '—')}</pre>
</div>
</div>
</div>
);
}
const panelStyle = {
background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
padding: 12,
borderRadius: 12,
border: '1px solid rgba(255,255,255,0.03)'
};
const cardSmallStyle = {
background:'#041018', padding:10, borderRadius:10, border:'1px solid rgba(255,255,255,0.02)', display:'flex', justifyContent:'space-between', alignItems:'center'
};