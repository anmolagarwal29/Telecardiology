const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const doctorTable = document.getElementById("doctor-list-table");

let doctorList = [];

async function fetchDoctorList() {
  doctorTable.innerHTML = "";
  try {
    const response = await fetch(`${backend_url}/get-doctors`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    doctorList = data;
    addRows(doctorList);
  } catch (error) {
    console.error("Error fetching doctor list:", error);
  }
}

function searchDoctor() {
  const search = document.getElementById("search-input").value;
  doctorTable.innerHTML = "";
  if (search) {
    const data = doctorList?.doctors?.filter(
      (doctor) =>
        doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
        doctor?.address?.toLowerCase().includes(search.toLowerCase()) ||
        doctor?.email?.toLowerCase().includes(search.toLowerCase()) ||
        doctor?.phone?.toLowerCase().includes(search.toLowerCase()) ||
        doctor?.area?.toLowerCase().includes(search.toLowerCase())
    );
    addRows({
      doctors: data,
    });
  } else {
    addRows(doctorList);
  }
}

function addRows(data) {
  data?.doctors?.forEach((doctor) => addRow(doctor));
}

function addRow(doctor) {
  const doctorRow = document.createElement("tr");
  doctorTable.appendChild(doctorRow);
  const doctorName = document.createElement("td");
  doctorName.textContent = doctor.name;
  doctorRow.appendChild(doctorName);
  const doctorAddress = document.createElement("td");
  doctorAddress.textContent = doctor.address;
  doctorRow.appendChild(doctorAddress);
  const doctorEmail = document.createElement("td");
  doctorEmail.textContent = doctor.email;
  doctorRow.appendChild(doctorEmail);
  const doctorContact = document.createElement("td");
  doctorContact.textContent = doctor.phone;
  doctorRow.appendChild(doctorContact);
  const doctorArea = document.createElement("td");
  doctorArea.textContent = doctor.area;
  doctorRow.appendChild(doctorArea);
  const actions = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.innerHTML = `<a href="./edit-doctor.html?id=${doctor._id}">Edit</a>`;
  actions.appendChild(editButton);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteDoctor(doctor._id);
  };
  actions.appendChild(deleteButton);
  doctorRow.appendChild(actions);
}

async function deleteDoctor(doctorId) {
  // Implement delete logic here, for example:
  if (confirm("Are you sure you want to delete this doctor?")) {
    try {
      const response = await fetch(`${backend_url}/user/${doctorId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchDoctorList();
        alert("Doctor deleted successfully!");
      } else {
        alert("Failed to delete doctor!");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("An error occurred while deleting doctor.");
    }
  }
}

fetchDoctorList();

document
  .getElementById("search-input")
  .addEventListener("keyup", () => searchDoctor());
