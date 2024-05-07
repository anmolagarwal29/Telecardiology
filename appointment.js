const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const getAppointments = async () => {
  const loggedInUser = localStorage.getItem("user");
  const user = JSON.parse(loggedInUser);
  const response = await fetch(`${backend_url}/get-appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: user._id,
      type: "doctor",
    }),
  });
  const data = await response.json();
  const appointmentTable = document.getElementById("appointments-table");
  data?.appointments?.forEach((appointment) => {
    const row = document.createElement("tr");
    const patientName = document.createElement("td");
    patientName.textContent = appointment.name;
    row.appendChild(patientName);
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
    const appointmentChat = document.createElement("td");
    appointmentChat.innerHTML = `<button><a href="./chat.html">Chat</button>`;
    const appointmentReports = document.createElement("td");
    for (index in appointment.files) {
      const linkButton = document.createElement("button");
      linkButton.innerHTML = `<a target="_blank" href="${
        appointment.files[index]
      }">Report ${+index + 1}</a>`;
      appointmentReports.appendChild(linkButton);
    }
    row.appendChild(appointmentReports);
    row.appendChild(appointmentChat);
    const appointmentPrescription = document.createElement("td");
    if (
      appointment.prescription?.medicines?.length ||
      appointment.prescription?.notes?.length
    ) {
      appointmentPrescription.innerHTML = `<button>Show Prescription</button>`;
      appointmentPrescription.addEventListener("click", () => {
        goToPrescription(appointment, user);
        window.location.replace(`/doctor/prescription.html`);
      });
    } else {
      appointmentPrescription.innerHTML = `<button>Prescribe</button>`;
      appointmentPrescription.addEventListener("click", () => {
        goToPrescription(appointment, user);
        window.location.replace(`/doctor/add-prescription.html`);
      });
    }
    row.appendChild(appointmentPrescription);
    const appointmentLink = document.createElement("td");
    appointmentLink.innerHTML = `<a target="_blank" href="https://meet.google.com/yqk-sqmc-nte ">${appointment.videoCallLink.toLowerCase()}</a>`;
    row.appendChild(appointmentLink);
    appointmentTable.appendChild(row);
  });
};

function goToPrescription(appointment, user) {
  localStorage.removeItem("currentPrescription");
  localStorage.setItem(
    "currentPrescription",
    JSON.stringify({
      ...appointment,
      doctor: {
        _id: appointment.doctor._id,
        name: user.name,
      },
    })
  );
}

getAppointments();
