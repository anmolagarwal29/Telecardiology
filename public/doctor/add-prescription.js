const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const currentPrescription = JSON.parse(
  localStorage.getItem("currentPrescription")
);

const medicines = [];

function generateMedicineInputs() {
  var numMedicines = parseInt(document.getElementById("numMedicines").value);
  var medicineInputs = document.getElementById("medicineInputs");
  medicineInputs.innerHTML = "";

  for (let i = 1; i <= numMedicines; i++) {
    medicines[i - 1] = {
      name: "",
      frequency: [],
    };
    var medicineRow = document.createElement("div");
    medicineRow.classList.add("medicine-row");

    var medicineLabel = document.createElement("label");
    medicineLabel.setAttribute("for", "medicine" + i);
    medicineLabel.textContent = "Medicine " + i + ":";

    var medicineInput = document.createElement("input");
    medicineInput.setAttribute("type", "text");
    medicineInput.setAttribute("id", "medicine" + i);
    medicineInput.setAttribute("name", "medicine" + i);
    medicineInput.setAttribute("placeholder", "Enter Medicine " + i);
    medicineInput.addEventListener("change", function (e) {
      updateMedicineName(i - 1, e.target.value);
    });

    var timingSelects = document.createElement("div");
    timingSelects.classList.add("timing-selects");

    var options = ["Morning", "Afternoon", "Evening"];
    var selectWrapper = document.createElement("div");

    var timingLabel = document.createElement("label");
    timingLabel.textContent = options[j];

    for (var j = 0; j < options.length; j++) {
      var timingSelect = document.createElement("input");
      timingSelect.setAttribute("id", "timing" + i + options[j]);
      timingSelect.setAttribute("name", "timing" + i + options[j]);
      timingSelect.setAttribute("type", "checkbox");
      const optionName = options[j];
      timingSelect.addEventListener("change", function (e) {
        updateMedicineFrequency(i - 1, optionName, e.target.checked);
      });
      var timingLabel = document.createElement("label");
      timingLabel.setAttribute("for", "timing" + i + options[j]);
      timingLabel.innerText = options[j];
      selectWrapper.appendChild(timingSelect);
      selectWrapper.appendChild(timingLabel);
      timingSelects.appendChild(selectWrapper);
    }

    medicineRow.appendChild(medicineLabel);
    medicineRow.appendChild(medicineInput);
    medicineRow.appendChild(timingSelects);

    medicineInputs.appendChild(medicineRow);
  }
}

const fillData = () => {
  const doctorName = document.getElementById("doctorName");
  doctorName.value = `Dr. ${currentPrescription.doctor.name}`;
  const patientName = document.getElementById("patientName");
  patientName.value = currentPrescription.name;
};

const addPrescription = async (e) => {
  e.preventDefault();
  const notes = document.getElementById("notes").value;
  const appointment_id = currentPrescription._id;
  const validMedicines = medicines.filter((medicine) => medicine.name);
  const prescription = {
    notes,
    medicines: validMedicines,
  };
  if (notes?.length > 0 || validMedicines?.length > 0) {
    try {
      const response = await fetch(`${backend_url}/add-prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id,
          prescription,
        }),
      });
      const data = await response.json();
      document.getElementById("error").innerText = data.message ?? data.error;
      localStorage.removeItem("currentPrescription");
      window.location.replace(`/doctor/appointment.html`);
    } catch (err) {
      console.log(err.error);
    }
  }
};

const updateMedicineName = (index, name) => {
  medicines[index].name = name;
  console.log(medicines);
};
const updateMedicineFrequency = (index, frequency, type) => {
  if (!medicines[index].frequency.includes(frequency)) {
    medicines[index].frequency.push(frequency);
  } else {
    if (type) {
      return;
    } else {
      medicines[index].frequency.splice(
        medicines[index].frequency.findIndex((e) => e === frequency),
        1
      );
    }
  }
};

generateMedicineInputs();
fillData();
document
  .getElementById("addPrescription")
  .addEventListener("submit", addPrescription);
