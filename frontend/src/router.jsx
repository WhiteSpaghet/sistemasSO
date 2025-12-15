// frontend/src/router.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ClientePage from "./pages/ClientePage";
import TaxiPage from "./pages/TaxiPage";
import AdminPage from "./pages/AdminPage";

export default function Router() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/" style={{ marginRight: 12 }}>Inicio</Link>
        <Link to="/cliente" style={{ marginRight: 12 }}>Cliente</Link>
        <Link to="/taxi" style={{ marginRight: 12 }}>Taxi</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cliente" element={<ClientePage />} />
        <Route path="/taxi" element={<TaxiPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
