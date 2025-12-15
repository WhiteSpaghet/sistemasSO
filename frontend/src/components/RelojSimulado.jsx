// frontend/src/components/RelojSimulado.jsx
import { useEffect, useState } from "react";
import { getClock } from "../api/statusApi";

export default function RelojSimulado() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const data = await getClock();
        setHora(data.hora);
      } catch (e) {
        // ignoramos errores por simplicidad
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>Hora simulada: {hora || "..."}</div>;
}
