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

            alert('Registration success');
            navigate('/dashboard');


        } catch(error: any){
            setErrorMessage(error.message);
        }
    }
    return (
                <div style={{ maxWidth: '400px', margin: '50px auto' }}>

        <h2>Register</h2>
        
        {errorMessage && <p style={{color: 'red'}} >{errorMessage}</p>}
        
        <form onSubmit={handleRegister}>
            <label>Username</label>
            <input type="text" value = {username} onChange={(e) => setUsername(e.target.value)} required></input>
            <label>Display Name</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required></input>
            <label>Email</label>
            <input type="email" value = {email} onChange={(e) => setEmail(e.target.value)} required></input>
            <label>Password</label>
            <input type="password" value= {password} onChange={(e) => setPassword(e.target.value)} required></input>
            <button type="submit">Masuk</button>

        </form>
        
        <p>Sudah punya akun? <Link to="/login">Masuk ke sini</Link></p>

        </div>
    )
}

export default Register;