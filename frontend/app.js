const video = document.getElementById("video");
const canvas = document.createElement("canvas");

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goToDetails() {
  show("details");
}

function goToCamera() {
  show("camera");

  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 720 },
      height: { ideal: 1280 }
    }
  }).then(stream => {
    video.srcObject = stream;
  });
}

function startCapture() {
  let count = 3;
  const cd = document.getElementById("countdown");

  const timer = setInterval(() => {
    cd.innerText = count;
    count--;

    if (count < 0) {
      clearInterval(timer);
      cd.innerText = "";
      capturePhoto();
    }
  }, 1000);
}

function capturePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  // Stop camera (important for iOS)
  video.srcObject.getTracks().forEach(t => t.stop());

  canvas.toBlob(blob => upload(blob), "image/png");
}

function upload(blob) {
  show("loader");

  const fd = new FormData();
  fd.append("photo", blob);
  fd.append("username", document.getElementById("username").value);
  fd.append("interest", document.getElementById("interest").value);

  fetch("https://action-figure-backend.onrender.com", {
    method: "POST",
    body: fd
  })
    .then(r => r.json())
    .then(data => {
      show("result");
      document.getElementById("finalImage").src = data.url;
      new QRCode(document.getElementById("qrcode"), data.url);
    });
}
