// frontend/src/App.jsx
import Router from "./router";
import RelojSimulado from "./components/RelojSimulado";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>UNIETAXI</h1>
        <RelojSimulado />
      </header>
      <Router />
    </div>
  );
}
