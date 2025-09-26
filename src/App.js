// src/App.js
import React, { useState } from "react";
import InventoryPage from "./pages/InventoryPage";
import RecordsPage from "./pages/RecordsPage";
import CroppingCyclesPage from "./pages/CroppingCyclesPage";
import fishLogo from "./logo-fish.svg";

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
          <img src={fishLogo} alt="Fish Logo" style={{ width: 38, height: 38, marginBottom: 10, opacity: 0.92 }} />
          <span style={{ fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: 1, textShadow: '0 2px 8px #23272a55' }}>Lim Fishpond MS</span>
        </div>
        <button
          onClick={() => setPage("cycles")}
          style={{
            width: '85%',
            padding: '10px 0',
            minWidth: 100,
            borderRadius: 8,
            background: page === 'cycles' ? '#23272a' : '#23272a',
            color: page === 'cycles' ? '#fff' : '#b9bbbe',
            border: 'none',
            fontWeight: 500,
            fontSize: 14,
            marginBottom: 12,
            cursor: 'pointer',
            boxShadow: page === 'cycles' ? '0 1px 4px #181a1b' : '0 1px 4px #181a1b',
            outline: page === 'cycles' ? '2px solid #7289da' : 'none',
            textAlign: 'center',
            transition: 'background 0.2s',
            opacity: 1
          }}
        >Cropping Cycles</button>
        <button
          onClick={() => setPage("records")}
          style={{
            width: '85%',
            padding: '10px 0',
            minWidth: 100,
            borderRadius: 8,
            background: page === 'records' ? '#23272a' : '#23272a',
            color: page === 'records' ? '#fff' : '#b9bbbe',
            border: 'none',
            fontWeight: 500,
            fontSize: 14,
            marginBottom: 12,
            cursor: 'pointer',
            boxShadow: page === 'records' ? '0 1px 4px #181a1b' : '0 1px 4px #181a1b',
            outline: page === 'records' ? '2px solid #7289da' : 'none',
            textAlign: 'center',
            transition: 'background 0.2s',
            opacity: 1
          }}
        >Records</button>
        <button
          onClick={() => setPage("inventory")}
          style={{
            width: '85%',
            padding: '10px 0',
            minWidth: 100,
            borderRadius: 8,
            background: page === 'inventory' ? '#23272a' : '#23272a',
            color: page === 'inventory' ? '#fff' : '#b9bbbe',
            border: 'none',
            fontWeight: 500,
            fontSize: 14,
            marginBottom: 12,
            cursor: 'pointer',
            boxShadow: page === 'inventory' ? '0 1px 4px #181a1b' : '0 1px 4px #181a1b',
            outline: page === 'inventory' ? '2px solid #7289da' : 'none',
            textAlign: 'center',
            transition: 'background 0.2s',
            opacity: 1
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
