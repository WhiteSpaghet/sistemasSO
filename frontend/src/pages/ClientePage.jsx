export function ClientePage({ accent = '#FF7A59', formatMoney = (v) => String(v) }){
const [resumen, setResumen] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


useEffect(()=>{
let mounted = true;
(async ()=>{
try{
const r = await fetch('http://localhost:5000/api/status/resumen');
if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
const j = await r.json();
if(mounted) setResumen(j);
}catch(e){ if(mounted) setError(String(e)); }
finally{ if(mounted) setLoading(false); }
})();
return ()=>{ mounted=false };
},[]);


// Ejemplo de pantalla cliente: mostrar viajes pendientes y coste estimado
const pendientes = resumen?.viajes_pendientes ?? 0;
const costeEstimado = resumen?.coste_medio_viaje ? (pendientes * resumen.coste_medio_viaje) : resumen?.importe_pendiente_total ?? 0;


return (
<div>
<div style={{ display:'flex', gap:12, marginBottom:12 }}>
<div style={panelStyle}>
<div style={{ color:'#AAB4C1' }}>Viajes pendientes</div>
<div style={{ fontSize:18, fontWeight:800, marginTop:6 }}>{loading ? '—' : pendientes}</div>
<div style={{ color:'#98A3B0', marginTop:8 }}>Número de solicitudes aún sin asignar</div>
</div>


<div style={panelStyle}>
<div style={{ color:'#AAB4C1' }}>Coste estimado</div>
<div style={{ fontSize:18, fontWeight:800, marginTop:6, color:accent }}>{loading ? '—' : formatMoney(costeEstimado)}</div>
<div style={{ color:'#98A3B0', marginTop:8 }}>Suma estimada para los viajes pendientes</div>
</div>
</div>


<div style={{ marginTop:8 }}>
<h3 style={{ margin:0, marginBottom:8 }}>Últimos viajes</h3>
<div style={{ display:'grid', gap:8 }}>
{/* Si el backend ofreciera una lista, la renderizaríamos; aquí mostramos placeholders si no hay lista */}
{(resumen?.ultimos_viajes && resumen.ultimos_viajes.length>0) ? resumen.ultimos_viajes.map((v,i)=> (
<div key={i} style={{ background:'#041018', padding:10, borderRadius:8 }}>
<div style={{ fontWeight:700 }}>{v.origen} → {v.destino}</div>
<div style={{ color:'#AAB4C1', fontSize:13 }}>{formatMoney(v.importe)}</div>
</div>
)) : <div style={{ color:'#98A3B0' }}>No hay viajes recientes.</div>}
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