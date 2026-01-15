// Set the backend API URL
const API = 'http://localhost:5000/api'; // Uncomment this for local testing

//const API = 'https://blog-api-4zax.onrender.com/api'; // Production backend


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Store token + user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data._id);   
      localStorage.setItem("role", data.role);    

      window.location.href = "./message/message.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
