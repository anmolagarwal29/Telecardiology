const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const form = document.getElementById("add-doctor-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastname = document.getElementById("lastName").value;
  const area = document.getElementById("area").value;
  const address = document.getElementById("address").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirm_password").value;
  register({
    firstName,
    lastname,
    address,
    mobile,
    email,
    password,
    confirm_password,
    area,
  });
});

const register = async function ({
  firstName,
  lastname,
  address,
  mobile,
  area,
  email,
  password,
  confirm_password,
}) {
  const errorDiv = document.getElementById("error");
  errorDiv.innerText = "";
  // API call
  const response = await fetch(`${backend_url}/register`, {
    body: JSON.stringify({
      name: `${firstName} ${lastname}`,
      email: email,
      password: password,
      confirm_password: confirm_password,
      phone: mobile,
      address: address,
      area: area,
      role: "doctor",
    }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json();
  if (json.user) {
    errorDiv.innerText = "Doctor Added Successfully";
  } else {
    errorDiv.innerText = json.error;
  }
};
