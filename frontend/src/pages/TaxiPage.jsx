export function TaxiPage({ accent = '#26C6AA', formatMoney = (v) => String(v) }){
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


const disponibles = resumen?.taxis_disponibles ?? resumen?.taxis ?? 0;
const ocupados = resumen?.taxis_ocupados ?? 0;


return (
<div>
<div style={{ display:'flex', gap:12 }}>
<div style={panelStyle}>
<div style={{ color:'#AAB4C1' }}>Taxis disponibles</div>
<div style={{ fontSize:20, fontWeight:800, marginTop:6 }}>{loading ? '—' : disponibles}</div>
</div>


<div style={panelStyle}>
<div style={{ color:'#AAB4C1' }}>Taxis ocupados</div>
<div style={{ fontSize:20, fontWeight:800, marginTop:6 }}>{loading ? '—' : ocupados}</div>
</div>
</div>


<div style={{ marginTop:12 }}>
<h3 style={{ margin:0, marginBottom:8 }}>Acciones</h3>
<div style={{ display:'flex', gap:8 }}>
<button style={{ padding:'10px 12px', borderRadius:10, border:'none', background:accent, color:'#071018', fontWeight:800, cursor:'pointer' }}>Marcar como disponible</button>
<button style={{ padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.04)', background:'transparent', color:'#EEF2F6', fontWeight:700, cursor:'pointer' }}>Pausar servicio</button>
</div>
</div>


<div style={{ marginTop:12 }}>
<h3 style={{ margin:0, marginBottom:8 }}>Estadísticas rápidas</h3>
<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
<div style={cardSmallStyle}><div style={{ color:'#AAB4C1' }}>Viajes hoy</div><div style={{ fontWeight:800 }}>{resumen?.viajes_hoy ?? '—'}</div></div>
<div style={cardSmallStyle}><div style={{ color:'#AAB4C1' }}>Ingresos hoy</div><div style={{ fontWeight:800 }}>{formatMoney(resumen?.ingresos_hoy ?? 0)}</div></div>
</div>
</div>
</div>
);
}