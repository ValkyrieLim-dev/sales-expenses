import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";

function Records() {
  const [records, setRecords] = useState([]);
  const [transaction, setTransaction] = useState("");
  const [sales, setSales] = useState("");
  const [expenses, setExpenses] = useState("");
  const [date, setDate] = useState("");

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sales & Expenses Records</h1>

      <input
        placeholder="Transaction"
        value={transaction}
        onChange={(e) => setTransaction(e.target.value)}
      />
      <input
        placeholder="Sales"
        type="number"
        value={sales}
        onChange={(e) => setSales(e.target.value)}
      />
      <input
        placeholder="Expenses"
        type="number"
        value={expenses}
        onChange={(e) => setExpenses(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={addRecord}>Add Record</button>

      <h2>Records List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Transaction</th>
            <th>Sales</th>
            <th>Expenses</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.transaction}</td>
              <td>{r.sales}</td>
              <td>{r.expenses}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Records;
