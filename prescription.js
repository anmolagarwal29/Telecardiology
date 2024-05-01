const appointment = JSON.parse(localStorage.getItem("currentPrescription"));
const { prescription } = appointment;

console.log(prescription);
if (prescription) {
  const date = new Date(prescription.timestamp || Date.now());
  document.getElementById("date").innerText =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  document.getElementById("doctor").innerText = appointment.doctor.name;
  document.getElementById("notes").innerText = prescription.notes;
  const table = document.createElement("medicines");
  prescription.medicines.forEach((medicine, index) => {
    const medRow = document.createElement("tr");
    const serialNo = document.createElement("td");
    serialNo.innerText = index + 1;
    medRow.appendChild(serialNo);
    const name = document.createElement("td");
    name.innerText = medicine.name;
    medRow.appendChild(name);
    const frequency = document.createElement("td");
    frequency.innerText = medicine.frequency.join(", ");
    medRow.appendChild(frequency);
    medicines.appendChild(medRow);
  });
}
