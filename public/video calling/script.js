const startCallButton = document.getElementById('startCallButton');
const endCallButton = document.getElementById('endCallButton');
const joinCallButton = document.getElementById('joinCallButton');
const callLinkInput = document.getElementById('callLink');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let remoteStream;

// Function to start the video call
async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// Function to end the video call
function endCall() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
  }
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
    remoteVideo.srcObject = null;
  }
}

// Function to join a video call using provided link
function joinCall() {
  const callLink = callLinkInput.value;
  if (!callLink) {
    alert('Please provide a valid video call link.');
    return;
  }
  // Here you would implement logic to connect to the video call using the provided link
  // For demonstration purposes, we'll simply log the call link to the console
  console.log('Joining video call:', callLink);
}

// Event listeners for buttons
startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);
joinCallButton.addEventListener('click', joinCall);
