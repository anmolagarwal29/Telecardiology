const ip = "localhost";
const backend_url = `http://${ip}:5050`;

document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  try {
    fetch(`${backend_url}/contact-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        message: message,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        document.getElementById("error").innerText = json.message;
      });
  } catch (e) {
    document.getElementById("error").innerText = e.error;
  }
});
