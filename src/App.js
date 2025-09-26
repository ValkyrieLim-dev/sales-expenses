// src/App.js
import React, { useState } from "react";
import InventoryPage from "./pages/InventoryPage";
import RecordsPage from "./pages/RecordsPage";
import CroppingCyclesPage from "./pages/CroppingCyclesPage";

function App() {
  const [page, setPage] = useState("cycles");

  return (
    <div style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif', background: '#181a1b', minHeight: '100vh', display: 'flex' }}>
      <aside style={{
        width: 240,
        background: '#23272a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 0',
        boxShadow: '2px 0 16px rgba(0,0,0,0.12)',
        minHeight: '100vh',
        borderRight: '2px solid #181a1b',
      }}>
        <div style={{ fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 48, letterSpacing: 1, textShadow: '0 2px 8px #23272a55' }}>Sales & Expenses</div>
        <button
          onClick={() => setPage("cycles")}
          style={{
            width: '85%',
            padding: '14px 0',
            borderRadius: '10px',
            border: 'none',
            background: page === 'cycles' ? '#7289da' : 'transparent',
            color: page === 'cycles' ? '#fff' : '#b9bbbe',
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 16,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: page === 'cycles' ? '0 2px 8px #7289da55' : 'none',
            outline: page === 'cycles' ? '2px solid #7289da' : 'none',
            letterSpacing: 0.5,
          }}
        >Cropping Cycles</button>
        <button
          onClick={() => setPage("records")}
          style={{
            width: '85%',
            padding: '14px 0',
            borderRadius: '10px',
            border: 'none',
            background: page === 'records' ? '#7289da' : 'transparent',
            color: page === 'records' ? '#fff' : '#b9bbbe',
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 16,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: page === 'records' ? '0 2px 8px #7289da55' : 'none',
            outline: page === 'records' ? '2px solid #7289da' : 'none',
            letterSpacing: 0.5,
          }}
        >Records</button>
        <button
          onClick={() => setPage("inventory")}
          style={{
            width: '85%',
            padding: '14px 0',
            borderRadius: '10px',
            border: 'none',
            background: page === 'inventory' ? '#7289da' : 'transparent',
            color: page === 'inventory' ? '#fff' : '#b9bbbe',
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 16,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: page === 'inventory' ? '0 2px 8px #7289da55' : 'none',
            outline: page === 'inventory' ? '2px solid #7289da' : 'none',
            letterSpacing: 0.5,
          }}
        >Inventory</button>
      </aside>

      <main style={{ flex: 1, maxWidth: 1000, margin: '40px auto', background: '#23272a', borderRadius: 20, boxShadow: '0 2px 24px rgba(0,0,0,0.12)', padding: 48 }}>
        {page === "inventory" && <InventoryPage />}
        {page === "records" && <RecordsPage />}
        {page === "cycles" && <CroppingCyclesPage />}
      </main>
    </div>
  );
}

export default App;
