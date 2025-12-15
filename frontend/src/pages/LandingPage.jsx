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
const panelStyle = {
background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
padding: 12,
borderRadius: 12,
border: '1px solid rgba(255,255,255,0.03)'
};
const cardSmallStyle = {
background:'#041018', padding:10, borderRadius:10, border:'1px solid rgba(255,255,255,0.02)', display:'flex', justifyContent:'space-between', alignItems:'center'
};