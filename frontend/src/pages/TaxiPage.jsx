// frontend/src/pages/TaxiPage.jsx
import { useEffect, useState } from "react";
import { getEstadoTaxi } from "../api/taxiApi";

export default function TaxiPage() {
  const [taxiId, setTaxiId] = useState(1);
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const est = await getEstadoTaxi(taxiId);
        setEstado(est);
      } catch (e) {
        // ignore
      }
    }, 1000);
    return () => clearInterval(id);
  }, [taxiId]);

  return (
    <div>
      <h2>Modo Taxi</h2>
      <div style={{ marginBottom: 8 }}>
        <label>
          ID Taxi:
          <input
            type="number"
            value={taxiId}
            onChange={(e) => setTaxiId(parseInt(e.target.value || "1", 10))}
          />
        </label>
      </div>
      {estado && estado.existe ? (
        <div style={{ border: "1px solid #ccc", padding: 8 }}>
          <p>Ocupado: {estado.ocupado ? "Sí" : "No"}</p>
          <p>Posición: ({estado.x}, {estado.y})</p>
          <p>Rating: {estado.rating}</p>
          <p>Ganancias día: {estado.ganancias_dia} €</p>
        </div>
      ) : (
        <p>No se encontró ese taxi.</p>
      )}
    </div>
  );
}
