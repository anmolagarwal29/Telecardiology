const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const getAppointments = async () => {
  const response = await fetch(`${backend_url}/get-all-appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const appointmentTable = document.getElementById("appointments-table");
  data?.appointments?.forEach((appointment) => {
    const row = document.createElement("tr");
    const patientName = document.createElement("td");
    patientName.textContent = appointment.name;
    row.appendChild(patientName);
    const doctorName = document.createElement("td");
    doctorName.textContent = `Dr. ${appointment.doctor?.name}`;
    row.appendChild(doctorName);
    const bookedBy = document.createElement("td");
    bookedBy.textContent = appointment.patient?.name;
    row.appendChild(bookedBy);
    const date = document.createElement("td");
    date.textContent = appointment.date;
    row.appendChild(date);
    const appointmentSlot = document.createElement("td");
    appointmentSlot.textContent = appointment.timeSlot;
    row.appendChild(appointmentSlot);
    appointmentTable.appendChild(row);
  });
};

getAppointments();
