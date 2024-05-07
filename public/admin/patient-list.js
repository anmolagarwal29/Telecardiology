const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const patientTable = document.getElementById("patient-list-table");

async function fetchPatientList() {
  const response = await fetch(`${backend_url}/get-patients`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  addRows(data);
}

function addRows(data) {
  data.patients.forEach((patient) => addRow(patient));
}

function addRow(patient) {
  const patientRow = document.createElement("tr");
  patientTable.appendChild(patientRow);
  const patientName = document.createElement("td");
  patientName.textContent = patient.name;
  patientRow.appendChild(patientName);
  const patientAddress = document.createElement("td");
  patientAddress.textContent = patient.address;
  patientRow.appendChild(patientAddress);
  const patientEmail = document.createElement("td");
  patientEmail.textContent = patient.email;
  patientRow.appendChild(patientEmail);
  const patientContact = document.createElement("td");
  patientContact.textContent = patient.phone;
  patientRow.appendChild(patientContact);
}

fetchPatientList();
