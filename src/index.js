function calculate() {
  // Get the values from the input boxes
  const sales = parseFloat(document.getElementById("sales").value) || 0;
  const expenses = parseFloat(document.getElementById("expenses").value) || 0;

  // Calculate profit
  const profit = sales - expenses;

  // Show result
  const output = document.getElementById("output");
  output.textContent = `Sales: ₱${sales} | Expenses: ₱${expenses} | Profit: ₱${profit}`;

  // --- Add to History ---
  const history = document.getElementById("history");
  const li = document.createElement("li");
  li.textContent = `Sales: ₱${sales}, Expenses: ₱${expenses}, Profit: ₱${profit}`;
  history.appendChild(li);

}
function clearHistory() {
  const history = document.getElementById("history");
  history.innersHTML = ""; // clears all <li> inside the <ul>
}