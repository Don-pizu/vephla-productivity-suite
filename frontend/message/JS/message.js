const API = 'https://vephla-productivity-suite-crl2.onrender.com/api'; // Production backend

const APP = 'https://vephla-productivity-suite-crl2.onrender.com'


//const API = 'https://localhost:5000/api'; // Production backend

//const APP = 'https://localhost:5000'

const statusEl = document.getElementById("status");
const chatEl = document.getElementById("chat");
const typingEl = document.getElementById("typing");
const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");
const token = localStorage.getItem("token");

if (!token) {
  statusEl.textContent = "🔴 Please login first";
  return;
}

const socket = io(APP, { 
  transports: ["websocket"],
  auth: {
    token
  }
  });

socket.on("connect", () => {
  statusEl.textContent = "🟢 Connected: " + socket.id;
});

socket.on("connect_error", (err) => {
  statusEl.textContent = "🔴 Connection Error";
  console.error("Connection error:", err.message);
});

//Join Room 'joinRoom'
joinBtn.addEventListener("click", () => {
  const userId = document.getElementById("userId").value;
  const roomId = document.getElementById("roomId").value;
  socket.emit("joinRoom", { userId, roomId });
});

//Send message 'sendMessage'
sendBtn.addEventListener("click", async () => {
  const roomId = document.getElementById("roomId").value;
  const sender = document.getElementById("userId").value;
  const message = document.getElementById("messageInput").value;
  const file = document.getElementById("fileInput").files[0];

  if (!message && !file) return;

  let attachment = null;

  //Upload file via HTTP
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/messages/upload`, {
      method: "POST",
       headers: {
      Authorization: `Bearer ${token}`   // Add auth header
    },
      body: formData
    });

    attachment = await res.json();
  }

  //Send socket message
  socket.emit("sendMessage", {
    roomId,
    sender,
    message,
    attachment
  });

  document.getElementById("messageInput").value = "";
  document.getElementById("fileInput").value = "";
});



//Show messages
socket.on("newMessage", (msg) => {
  const div = document.createElement("div");
  div.className = "message";

  // Sender + text
  if (msg.message) {
    const text = document.createElement("div");
    text.textContent = `${msg.sender}: ${msg.message}`;
    div.appendChild(text);
  }

  // Attachment rendering
  if (msg.attachment && msg.attachment.url) {
    if (msg.attachment.type === "image") {
      const img = document.createElement("img");
      img.src = msg.attachment.url;
      img.alt = "chat image";
      div.appendChild(img);

    } else if (msg.attachment.type === "video") {
      const video = document.createElement("video");
      video.src = msg.attachment.url;
      video.controls = true;
      div.appendChild(video);

    } else {
      const link = document.createElement("a");
      link.href = msg.attachment.url;
      link.target = "_blank";
      link.textContent = "Download file";
      div.appendChild(link);
    }
  }

  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
});


socket.on("system", (msg) => {
  const div = document.createElement("div");
  div.className = "system";
  div.textContent = msg;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
});


// typing indicator
let typingTimeout;
document.getElementById("messageInput").addEventListener("input", () => {
  const roomId = document.getElementById("roomId").value;
  const user = document.getElementById("userId").value;

  socket.emit("typing", { roomId, user });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingEl.textContent = "";
  }, 1500);
});

socket.on("typing", (user) => {
  typingEl.textContent = `${user} is typing...`;
});
