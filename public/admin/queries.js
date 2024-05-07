const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const queriesTable = document.getElementById("queries-table");

async function fetchPatientList() {
  const response = await fetch(`${backend_url}/get-queries`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  addRows(data);
}

function addRows(data) {
  data.queries.forEach((query) => addRow(query));
}

function addRow(query) {
  const queriesRow = document.createElement("tr");
  queriesTable.appendChild(queriesRow);
  const queriesName = document.createElement("td");
  queriesName.textContent = query.name;
  queriesRow.appendChild(queriesName);
  const queriesEmail = document.createElement("td");
  queriesEmail.textContent = query.email;
  queriesRow.appendChild(queriesEmail);
  const queriesContact = document.createElement("td");
  queriesContact.textContent = query.phone;
  queriesRow.appendChild(queriesContact);
  const queriesMessage = document.createElement("td");
  queriesMessage.textContent = query.message;
  queriesRow.appendChild(queriesMessage);
}

fetchPatientList();
