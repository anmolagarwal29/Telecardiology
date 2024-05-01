const loggedInUser = localStorage.getItem("user");
document.getElementById("logout-button")?.addEventListener("click", logout);

if (loggedInUser) {
  const user = JSON.parse(loggedInUser);
  redirect(user.role);
} else {
  redirect();
}

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

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("currentPrescription");
  redirect();
}
