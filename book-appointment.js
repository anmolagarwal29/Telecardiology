const ip = "localhost";
const backend_url = `http://${ip}:5050`;
let timeSlot;

document.getElementById("appointment-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const timeSlot = document.getElementById("timeSlot").value;
  if (!timeSlot) {
    return (document.getElementById("time-slot-error").style.display = "block");
  }
  bookAppointment();
});

async function bookAppointment() {
  const loggedInUser = localStorage.getItem("user");
  const user = JSON.parse(loggedInUser);

  const form = document.getElementById("appointment-form");
  const formData = new FormData(form);
  formData.append("patient", user._id);

  try {
    const response = await fetch(`${backend_url}/check-slot`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    document.getElementById("error").innerText =
      data.message ?? data.error ?? "";
    if (!data.error) {
      startPaymentProcess(async (response) => {
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        try {
          const response = await fetch(`${backend_url}/book-appointment`, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          document.getElementById("error").innerText =
            data.message ?? data.error;
        } catch (err) {
          console.log(err.error);
        }
      });
    }
  } catch (err) {
    console.log(err.error);
  }
}

async function fetchDoctors() {
  const response = await fetch(`${backend_url}/get-doctors`);
  const data = await response.json();
  const doctorSelect = document.getElementById("doctor");
  data.doctors?.forEach((doctor) => {
    const option = document.createElement("option");
    option.value = doctor._id;
    option.innerText = `Dr. ${doctor.name}`;
    doctorSelect.appendChild(option);
  });
}

async function startPaymentProcess(callback) {
  const loggedInUser = localStorage.getItem("user");
  // Fetch the order from your backend
  const order = await fetch(`${backend_url}/create-order`, {
    method: "POST",
  }).then((t) => t.json());

  const options = {
    key: order.key, // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    currency: order.currency,
    name: "Telecardiology",
    description: "Booking Transaction",
    image: "https://telecardiology.com/your_logo",
    order_id: order.id, // Pass the `id` obtained in the response of Step 1
    handler: (response) => callback(response),
    prefill: {
      name: loggedInUser.name,
      email: loggedInUser.email,
      contact: "8384038810",
    },
    notes: {
      address: "IITKGP",
    },
    theme: {
      color: "#F37254",
    },
  };

  const paymentObject = new Razorpay(options);
  paymentObject.open();
}

fetchDoctors();
