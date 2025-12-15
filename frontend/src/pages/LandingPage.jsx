// frontend/src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <h2>Bienvenido a UNIETAXI</h2>
      <p>Elige un modo:</p>
      <ul>
        <li><Link to="/cliente">Modo Cliente</Link></li>
        <li><Link to="/taxi">Modo Taxi</Link></li>
        <li><Link to="/admin">Modo Admin (concurrencia)</Link></li>
      </ul>
    </div>
  );
}
