// frontend/src/pages/ClientePage.jsx
import { useState, useEffect } from "react";
import MapaSimple from "../components/MapaSimple";
import ListaViajes from "../components/ListaViajes";
import { solicitarViaje, getEstadoCliente } from "../api/clienteApi";

const CLIENTE_ID = 1; // simplificado

export default function ClientePage() {
  const [origen, setOrigen] = useState({ x: 1, y: 1 });
  const [destino, setDestino] = useState({ x: 5, y: 5 });
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const pedirTaxi = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const res = await solicitarViaje(CLIENTE_ID, origen, destino);
      if (res.ok) {
        setMensaje(`Viaje creado con id ${res.viajeId}`);
      } else {
        setMensaje("Error al solicitar viaje");
      }
    } catch (e) {
      setMensaje("Error de red");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const est = await getEstadoCliente(CLIENTE_ID);
        setEstado(est);
      } catch (e) {
        // nada
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Modo Cliente</h2>
      <MapaSimple
        origen={origen}
        destino={destino}
        onChangeOrigen={setOrigen}
        onChangeDestino={setDestino}
      />
      <button onClick={pedirTaxi} disabled={loading}>
        {loading ? "Solicitando..." : "Solicitar taxi"}
      </button>
      <p>{mensaje}</p>
      <ListaViajes estado={estado} />
    </div>
  );
}
