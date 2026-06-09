import React from "react";
import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

const Register = () =>{
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({username, displayName, email, password}),
            });

            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || 'registration failed');
            }

            alert('Registration success, please login');
            navigate('/login');


        } catch(error: any){
            setErrorMessage(error.message);
        }
    }
   return (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#efefef",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
    }}
  >
    {/* Logo */}
    <div style={{ textAlign: "center" }}>
      <img
        src="/logo.png"
        alt="GoDev"
        style={{
          width: "90px",
          marginBottom: "15px",
        }}
      />

      <h1
        style={{
          color: "#2616d9",
          fontSize: "56px",
          fontWeight: "800",
          marginBottom: "10px",
        }}
      >
        GoDev
      </h1>

      <p
        style={{
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "1.1",
          marginBottom: "25px",
        }}
      >
        Fill in the credentials below to make your
        <br />
        GoDev account and start your journey!
      </p>
    </div>

    {errorMessage && (
      <p
        style={{
          color: "red",
          marginBottom: "15px",
        }}
      >
        {errorMessage}
      </p>
    )}

    <form
      onSubmit={handleRegister}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "25px",
      }}
    >
      {/* CARD 1 */}
      <div
        style={{
          width: "360px",
          backgroundColor: "#dde2e8",
          padding: "18px",
          borderRadius: "18px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: "700",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          Enter your desired username.
        </label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="This should contain letters and numbers!"
          required
          style={{
            width: "100%",
            height: "34px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#d1d1d1",
            padding: "0 15px",
            marginBottom: "15px",
          }}
        />

        <label
          style={{
            display: "block",
            fontWeight: "700",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          Make a strong password!
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Include unique letters, numbers, and capital letters!"
          required
          style={{
            width: "100%",
            height: "34px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#d1d1d1",
            padding: "0 15px",
          }}
        />
      </div>

      {/* CARD 2 */}
      <div
        style={{
          width: "360px",
          backgroundColor: "#dde2e8",
          padding: "18px",
          borderRadius: "18px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: "700",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          Enter your Email address.
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="@gmail.com"
          required
          style={{
            width: "100%",
            height: "34px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#d1d1d1",
            padding: "0 15px",
            marginBottom: "15px",
          }}
        />

        <label
          style={{
            display: "block",
            fontWeight: "700",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          Enter your display name.
        </label>

        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your public profile name"
          style={{
            width: "100%",
            height: "34px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#d1d1d1",
            padding: "0 15px",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "30px",
          padding: "12px 28px",
          fontSize: "18px",
          fontWeight: "700",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Sign Up
      </button>
    </form>

    <p style={{ marginTop: "20px" }}>
      Sudah punya akun?{" "}
      <Link to="/login">Masuk ke sini</Link>
    </p>
  </div>
);
}

export default Register;