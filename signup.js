const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const form = document.getElementById("register-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastname = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirm_password").value;
  register(
    firstName,
    lastname,
    address,
    mobile,
    email,
    password,
    confirm_password
  );
});

function redirect(role = "") {
  if (role === "admin") {
    window.location.pathname !== "/admin/dashboard.html" &&
      window.location.replace("/admin/dashboard.html");
  } else if (role === "doctor") {
    window.location.pathname !== "/doctor/dashboard.html" &&
      window.location.replace("/doctor/dashboard.html");
  } else if (role === "patient") {
    window.location.pathname !== "/patient/dashboard.html" &&
      window.location.replace("/patient/dashboard.html");
  } else {
    window.location.pathname !== "/sign-in.html" &&
      window.location.replace("/sign-in.html");
  }
}

const register = async function (
  firstName,
  lastname,
  address,
  mobile,
  email,
  password,
  confirm_password
) {
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
    }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json();
  if (json.user) {
    localStorage.setItem("user", JSON.stringify(json.user));
    redirect(json.user.role);
  } else {
    errorDiv.innerText = json.error;
  }
};
