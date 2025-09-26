import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";


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
    <div style={{ padding: "20px" }}>
      <h1>Inventory</h1>
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>

      <h2>Items List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
