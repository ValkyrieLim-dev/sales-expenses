import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";

function Records() {
  const [records, setRecords] = useState([]);
  const [transaction, setTransaction] = useState("");
  const [sales, setSales] = useState("");
  const [expenses, setExpenses] = useState("");
  const [date, setDate] = useState("");
  // Search and filter state
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    const { data, error } = await supabase.from("records").select("*");
    if (error) console.error("Fetch error:", error);
    else setRecords(data);
  }

  async function addRecord() {
    if (!transaction || !date) return;
    const { error } = await supabase.from("records").insert([
      {
        transaction,
        sales: parseFloat(sales) || 0,
        expenses: parseFloat(expenses) || 0,
        date,
      },
    ]);
    if (error) console.error("Insert error:", error.message, error.details);
    else {
      setTransaction("");
      setSales("");
      setExpenses("");
      setDate("");
      fetchRecords(); // refresh table
    }
  }

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchesSearch = search.trim() === "" || r.transaction.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ padding: 32, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', background: '#181a1b', minHeight: '100vh' }}>
      <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 28, color: '#fff', letterSpacing: 1 }}>Sales & Expenses Records</h1>
      <div style={{ marginBottom: 18, display: 'flex', gap: 16 }}>
        <input
          type="text"
          placeholder="Search transaction..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 220, background: '#23272a', color: '#fff' }}
        />
      </div>
      <div style={{ marginBottom: 28, display: 'flex', gap: 16 }}>
        <input
          placeholder="Transaction"
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 200, background: '#23272a', color: '#fff' }}
        />
        <input
          placeholder="Sales"
          type="number"
          value={sales}
          onChange={(e) => setSales(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 120, background: '#23272a', color: '#fff' }}
        />
        <input
          placeholder="Expenses"
          type="number"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 120, background: '#23272a', color: '#fff' }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #23272a', fontSize: 17, width: 160, background: '#23272a', color: '#fff' }}
        />
        <button onClick={addRecord} style={{ padding: '10px 24px', borderRadius: 8, background: '#7289da', color: '#fff', fontWeight: 700, border: 'none', fontSize: 17, boxShadow: '0 2px 8px #7289da55', cursor: 'pointer' }}>Add Record</button>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#fff' }}>Records List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#23272a', color: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
        <thead>
          <tr style={{ background: '#181a1b' }}>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>ID</th>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Transaction</th>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Sales</th>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Expenses</th>
            <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((r) => (
            <tr key={r.id} style={{ background: '#23272a', borderBottom: '1px solid #36393f' }}>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{r.id}</td>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{r.transaction}</td>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{r.sales}</td>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{r.expenses}</td>
              <td style={{ padding: '12px 8px', fontSize: 16 }}>{r.date}</td>
            </tr>
          ))}
          {filteredRecords.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '12px 8px', fontSize: 16, color: '#b9bbbe', textAlign: 'center' }}>No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Records;
