// frontend/src/components/PanelMetricas.jsx
export default function PanelMetricas({ metricas }) {
  if (!metricas) return <p>Sin datos aún.</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: 8, marginTop: 12 }}>
      <h3>Métricas del sistema</h3>
      <p>Nº taxis: {metricas.num_taxis}</p>
      <p>Taxis ocupados: {metricas.taxis_ocupados}</p>
      <p>Taxis libres: {metricas.taxis_libres}</p>
      <p>Nº viajes totales: {metricas.num_viajes}</p>
      <p>Nº viajes finalizados: {metricas.num_viajes_finalizados}</p>
      <p>Ganancias empresa (día): {metricas.ganancias_empresa_dia} €</p>
      <p>Ganancias empresa (mes): {metricas.ganancias_empresa_mes} €</p>
      <p>Tiempo medio de espera (s): {metricas.tiempo_medio_espera?.toFixed ? metricas.tiempo_medio_espera.toFixed(2) : metricas.tiempo_medio_espera}</p>
    </div>
  );
}
