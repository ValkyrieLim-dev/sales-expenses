// src/App.js
import React, { useState } from "react";
import InventoryPage from "./pages/InventoryPage";
import RecordsPage from "./pages/RecordsPage";

function App() {
  const [page, setPage] = useState("inventory");

  return (
    <div>
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setPage("inventory")}>Inventory</button>
        <button onClick={() => setPage("records")}>Records</button>
      </nav>

      {page === "inventory" ? <InventoryPage /> : <RecordsPage />}
    </div>
  );
}

export default App;
