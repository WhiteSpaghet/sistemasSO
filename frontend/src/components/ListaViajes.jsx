// frontend/src/components/ListaViajes.jsx
export default function ListaViajes({ estado }) {
  if (!estado || !estado.tiene_viaje) {
    return <p>No tienes viajes activos.</p>;
  }

  const v = estado.viaje;
  return (
    <div style={{ border: "1px solid #ddd", padding: 8 }}>
      <h3>Viaje actual</h3>
      <p>ID: {v.id}</p>
      <p>Estado: {v.estado}</p>
      <p>Tarifa: {v.tarifa} €</p>
      <p>Origen: ({v.origen[0]}, {v.origen[1]})</p>
      <p>Destino: ({v.destino[0]}, {v.destino[1]})</p>
      <p>Tiempo de espera (s): {v.tiempo_espera?.toFixed ? v.tiempo_espera.toFixed(2) : v.tiempo_espera}</p>
      <p>Duración (s): {v.duracion?.toFixed ? v.duracion.toFixed(2) : v.duracion}</p>
    </div>
  );
}
