import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Contador: {contador}</h1>
      <button onClick={() => setContador(contador + 1)}>Incrementar</button>
      <button onClick={() => setContador(0)} style={{ marginLeft: "10px" }}>
        Resetear
      </button>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Contador />);
