import React, { useState } from "react";

function App() {
  const [sales, setSales] = useState("");
  const [expenses, setExpenses] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);

  function calculate() {
    const s = parseFloat(sales) || 0;
    const e = parseFloat(expenses) || 0;
    const profit = s - e;
    const result = `Sales: ₱${s} | Expenses: ₱${e} | Profit: ₱${profit}`;

    setOutput(result);
    setHistory([...history, result]);
    setSales("");
    setExpenses("");
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Fishpond MS</h1>

      <div>
        <label>Sales: </label>
        <input
          type="number"
          value={sales}
          onChange={(e) => setSales(e.target.value)}
        />
      </div>

      <div>
        <label>Expenses: </label>
        <input
          type="number"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
        />
      </div>

      <button onClick={calculate}>Calculate Profit</button>

      <p>{output}</p>

      <h2>History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}

export default App;
