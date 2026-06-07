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
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>

        <h2>Login</h2>
        
        {errorMessage && <p style={{color: 'red'}} >{errorMessage}</p>}
        
        <form onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" value = {email} onChange={(e) => setEmail(e.target.value)} required></input>
            <label>Password</label>
            <input type="password" value= {password} onChange={(e) => setPassword(e.target.value)} required></input>
            <button type="submit">Masuk</button>

        </form>
        <p>Belum punya akun? <Link to="/register">daftar di sini</Link></p>
        </div>
        
    );
}
export default Login;