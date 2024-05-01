const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  login(username, password);
});

const login = async function (username, password) {
  const errorDiv = document.getElementById("error");
  errorDiv.innerText = "";
  // API call
  const response = await fetch(`${backend_url}/login`, {
    body: JSON.stringify({ input: username, password: password }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json();
  console.log(json);
  if (json.user) {
    localStorage.setItem("user", JSON.stringify(json.user));
    redirect(json.user.role);
  } else {
    errorDiv.innerText = json.error;
  }
};
