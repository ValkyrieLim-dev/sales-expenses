import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";


function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from("inventory").select("*");
    if (error) console.error("Fetch error:", error);
    else setItems(data);
  }

  async function addItem() {
    if (!name || !quantity) return;
    const { error } = await supabase
      .from("inventory")
      .insert([{ name, quantity }]);
    if (error) console.error("Insert error:", error);
    else {
      setName("");
      setQuantity("");
      fetchItems(); // refresh table
    }
  }

  return (
    <div style={{ padding: 32, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', background: '#181a1b', minHeight: '100vh' }}>
      <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 28, color: '#fff', letterSpacing: 1 }}>Inventory</h1>
      <div style={{ marginBottom: 28, display: 'flex', gap: 16 }}>
        <input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 240, background: '#23272a', color: '#fff' }}
        />
        <input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 140, background: '#23272a', color: '#fff' }}
        />
        <button 
          onClick={addItem}
          style={{
            padding: '10px 0',
            minWidth: 120,
            borderRadius: 8,
            background: '#23272a',
            color: '#fff',
            border: 'none',
            fontWeight: 500,
            fontSize: 14,
            boxShadow: '0 1px 4px #181a1b',
            cursor: 'pointer',
            transition: 'background 0.2s',
            opacity: 1,
            textAlign: 'center'
          }}
        >Add Item</button>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#fff' }}>Items List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#23272a', color: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
        <thead>
          <tr style={{ background: '#181a1b' }}>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>ID</th>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Name</th>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} style={{ background: '#23272a', borderBottom: '1px solid #36393f' }}>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{i.id}</td>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{i.name}</td>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{i.quantity}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: '12px 8px', fontSize: 16, color: '#b9bbbe', textAlign: 'center' }}>No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
