import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Succesfully app developed</h1>
      <p className="app-description">Your app is running! Start Coding</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
