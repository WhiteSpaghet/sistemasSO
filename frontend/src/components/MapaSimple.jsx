// frontend/src/components/MapaSimple.jsx
export default function MapaSimple({ origen, destino, onChangeOrigen, onChangeDestino }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 8, marginBottom: 12 }}>
      <h3>Mapa (simplificado)</h3>
      <div>
        <label>
          Origen X:
          <input
            type="number"
            value={origen.x}
            onChange={(e) => onChangeOrigen({ ...origen, x: parseFloat(e.target.value) })}
          />
        </label>
        <label style={{ marginLeft: 8 }}>
          Y:
          <input
            type="number"
            value={origen.y}
            onChange={(e) => onChangeOrigen({ ...origen, y: parseFloat(e.target.value) })}
          />
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>
          Destino X:
          <input
            type="number"
            value={destino.x}
            onChange={(e) => onChangeDestino({ ...destino, x: parseFloat(e.target.value) })}
          />
        </label>
        <label style={{ marginLeft: 8 }}>
          Y:
          <input
            type="number"
            value={destino.y}
            onChange={(e) => onChangeDestino({ ...destino, y: parseFloat(e.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}
