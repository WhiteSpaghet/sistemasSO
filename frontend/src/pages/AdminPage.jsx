// frontend/src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { iniciarEscenario, pararEscenario, getMetricas } from "../api/adminApi";
import PanelMetricas from "../components/PanelMetricas";
import { getResumen } from "../api/statusApi";

export default function AdminPage() {
  const [numTaxis, setNumTaxis] = useState(3);
  const [numClientes, setNumClientes] = useState(10);
  const [tasa, setTasa] = useState(2);
  const [metricas, setMetricas] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const start = async () => {
    const res = await iniciarEscenario(numTaxis, numClientes, tasa);
    setMensaje(res.mensaje || "Escenario iniciado");
  };

  const stop = async () => {
    const res = await pararEscenario();
    setMensaje("Escenario detenido");
  };

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const m = await getMetricas();
        setMetricas(m);
        const r = await getResumen();
        setResumen(r);
      } catch (e) {
        // ignorar
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Modo Admin / Concurrencia</h2>
      <div style={{ border: "1px solid #ddd", padding: 8 }}>
        <h3>Configurar escenario</h3>
        <div>
          <label>
            Nº Taxis:
            <input
              type="number"
              value={numTaxis}
              onChange={(e) => setNumTaxis(parseInt(e.target.value || "1", 10))}
            />
          </label>
        </div>
        <div>
          <label>
            Nº Clientes:
            <input
              type="number"
              value={numClientes}
              onChange={(e) => setNumClientes(parseInt(e.target.value || "1", 10))}
            />
          </label>
        </div>
        <div>
          <label>
            Tasa llegadas (clientes / min sim):
            <input
              type="number"
              value={tasa}
              onChange={(e) => setTasa(parseFloat(e.target.value || "1"))}
            />
          </label>
        </div>
        <button onClick={start} style={{ marginRight: 8 }}>Iniciar escenario</button>
        <button onClick={stop}>Parar escenario</button>
        <p>{mensaje}</p>
      </div>

      <PanelMetricas metricas={metricas} />

      <div style={{ border: "1px solid #ccc", padding: 8, marginTop: 12 }}>
        <h3>Resumen rápido</h3>
        <pre style={{ fontSize: 12 }}>
          {resumen ? JSON.stringify(resumen, null, 2) : "Sin datos"}
        </pre>
      </div>
    </div>
  );
}
