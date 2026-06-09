// import React from "react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        try{
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || 'login failed');
            }
            localStorage.setItem('token', data.token);
            if (data?.user?.id) {
                localStorage.setItem('id', String(data.user.id));
            }
            alert('Login succesfull');
            navigate('/dashboard');

        }
        catch(error: any){
            setErrorMessage(error.message);
        }
    }
    
    return (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#f4f4f4",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
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
          color: "#2b23d6",
          fontSize: "56px",
          fontWeight: "800",
          marginBottom: "15px",
        }}
      >
        GoDev
      </h1>
    </div>

    <p
      style={{
        textAlign: "center",
        fontWeight: "600",
        fontSize: "18px",
        maxWidth: "350px",
        marginBottom: "25px",
      }}
    >
      Log In to your account with the proper credentials.
    </p>

    {errorMessage && (
      <p
        style={{
          color: "red",
          marginBottom: "10px",
        }}
      >
        {errorMessage}
      </p>
    )}

    <form
      onSubmit={handleLogin}
      style={{
        width: "350px",
        backgroundColor: "#e8edf3",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <label
        style={{
          fontWeight: "700",
          fontSize: "18px",
        }}
      >
        Username
      </label>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          height: "38px",
          borderRadius: "20px",
          border: "none",
          outline: "none",
          backgroundColor: "#d8d8d8",
          padding: "0 15px",
        }}
      />

      <label
        style={{
          fontWeight: "700",
          fontSize: "18px",
          marginTop: "5px",
        }}
      >
        Password
      </label>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          height: "38px",
          borderRadius: "20px",
          border: "none",
          outline: "none",
          backgroundColor: "#d8d8d8",
          padding: "0 15px",
        }}
      />

      <button
        type="submit"
        style={{
          marginTop: "20px",
          alignSelf: "center",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "30px",
          padding: "12px 30px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Log In
      </button>
    </form>

    <p style={{ marginTop: "20px" }}>
      Belum punya akun?{" "}
      <Link to="/register">daftar di sini</Link>
    </p>
  </div>
);
}
export default Login;