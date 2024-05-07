const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const loggedInUser = localStorage.getItem("user");
const user = JSON.parse(loggedInUser);

const getAppointments = async () => {
  const response = await fetch(`${backend_url}/get-appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: user._id,
      type: "patient",
    }),
  });
  const data = await response.json();
  const appointmentTable = document.getElementById("appointments-table");
  data?.appointments?.forEach((appointment) => {
    const row = document.createElement("tr");
    const doctorName = document.createElement("td");
    doctorName.textContent = `Dr. ${appointment.doctor.name}`;
    row.appendChild(doctorName);
    const date = document.createElement("td");
    date.textContent = appointment.date;
    row.appendChild(date);
    const appointmentSlot = document.createElement("td");
    appointmentSlot.textContent = appointment.timeSlot;
    row.appendChild(appointmentSlot);
    const appointmentChat = document.createElement("td");
    appointmentChat.innerHTML = `<button><a href="./chat.html">Chat</button>`;
    row.appendChild(appointmentChat);
    appointmentTable.appendChild(row);
    const appointmentReports = document.createElement("td");
    for (index in appointment.files) {
      const linkButton = document.createElement("button");
      linkButton.innerHTML = `<a target="_blank" href="${
        appointment.files[index]
      }">Report ${+index + 1}</a>`;
      appointmentReports.appendChild(linkButton);
    }
    const testName = document.createElement("td");
    testName.textContent = appointment.testName || "-";
    row.appendChild(testName);
    row.appendChild(appointmentReports);
    appointmentTable.appendChild(row);
    const appointmentPrescription = document.createElement("td");
    if (appointment.prescription?.medicines?.length) {
      appointmentPrescription.innerHTML = `<button>Show Prescription</button>`;
      appointmentPrescription.addEventListener("click", () => {
        goToPrescription(appointment, user);
        window.location.replace(`/patient/prescription.html`);
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
      patient: {
        _id: appointment.patient._id,
        name: user.name,
      },
    })
  );
}

getAppointments();
