const messageBox = document.querySelector("#messages");
const sendButton = document.querySelector("#send-button");
const textBox = document.querySelector("#text-box");

const socket = io();

function createMessage(text, ownMessage = false) {
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message";
  const subMesssageElement = document.createElement("div");
  subMesssageElement.className =
    "px-4 py-4 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600";
  if (ownMessage) {
    subMesssageElement.className += " float-right bg-blue-800 text-white";
  }
  subMesssageElement.innerText = text;
  messageElement.appendChild(subMesssageElement);

  messageBox.appendChild(messageElement);
}

socket.on("receive-message", (message) => {
  createMessage(message);
});

sendButton.addEventListener("click", () => {
  if (textBox.value != "") {
    socket.emit("send-message", textBox.value);
    createMessage(textBox.value, true);
    textBox.value = "";
  }
});

textBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && textBox.value != "") {
    socket.emit("send-message", textBox.value);
    createMessage(textBox.value, true);
    textBox.value = "";
  }
});
