function calculate() {
  const sales = parseFloat(document.getElementById("sales").value) || 0;
  const expenses = parseFloat(document.getElementById("expenses").value) || 0;
  const profit = sales - expenses;

  const output = document.getElementById("output");
  output.textContent = `Sales: ₱${sales} | Expenses: ₱${expenses} | Profit: ₱${profit}`;

  const history = document.getElementById("history");
  const li = document.createElement("li");
  li.textContent = `Sales: ₱${sales}, Expenses: ₱${expenses}, Profit: ₱${profit}`;
  history.appendChild(li);

  document.getElementById("sales").value = "";
  document.getElementById("expenses").value = "";
}

// 👇 this must be OUTSIDE calculate()
function clearHistory() {
  const history = document.getElementById("history");
  history.innerHTML = ""; // clears all list items
}
