import { useState, useEffect } from "react";

function Register() {
  const [csrfToken, setCsrfToken] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Fetch CSRF token once when component mounts
  useEffect(() => {
    fetch("http://localhost:8000/csrf-token", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("CSRF token fetched:", data.csrf_token);
        setCsrfToken(data.csrf_token);
      })
      .catch((err) => console.error("Failed to fetch CSRF:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // 🔑 required
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage("❌ " + err.detail);
      } else {
        const data = await res.json();
        setMessage("✅ Registered user: " + data.username);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
