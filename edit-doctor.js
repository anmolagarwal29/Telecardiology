const ip = "localhost";
const backend_url = `http://${ip}:5050`;

const form = document.getElementById("edit-doctor-form");
let _id = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("firstName").value;
  const area = document.getElementById("area").value;
  const address = document.getElementById("address").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  updateDoctor({
    name,
    mobile,
    email,
    area,
    address,
  });
});

const updateDoctor = async function ({ name, mobile, area, email, address }) {
  const errorDiv = document.getElementById("error");
  errorDiv.innerText = "";
  // API call
  const response = await fetch(`${backend_url}/update-user/${_id}`, {
    body: JSON.stringify({
      name: name,
      email: email,
      phone: mobile,
      area: area,
      address: address,
    }),
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json();
  if (json.user) {
    errorDiv.innerText = "Doctor Updated Successfully";
    getDoctorInfo();
  } else {
    errorDiv.innerText = json.error;
  }
};

function getDoctorInfo() {
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const userId = getQueryParam("id");
  _id = userId;

  fetch(`/get-user/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        const user = data.user;
        document.getElementById("firstName").value = user.name || "";
        document.getElementById("area").value = user.area || "";
        document.getElementById("address").value = user.address || "";
        document.getElementById("mobile").value = user.phone || "";
        document.getElementById("email").value = user.email || "";
      } else {
        console.error("Failed to fetch user:", data.error);
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

document.addEventListener("DOMContentLoaded", getDoctorInfo());
