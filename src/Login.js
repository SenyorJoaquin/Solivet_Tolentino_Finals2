/* Login.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from './firebase'; // Import Firebase configuration
import './Login.css'; // Import custom CSS for login page styling
import logo from './logo.png'; // Import the logo image

const Login = () => {
  const navigate = useNavigate(); // Initializes useNavigate

  // States for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Queues Firebase for user with entered username
      const userDoc = await firestore.collection('LoginData').where('username', '==', username).get();

      if (userDoc.empty) {
        setError('User not found');
        return;
      }

      // Checks if password matches
      const userData = userDoc.docs[0].data();
      if (userData.password !== password) {
        setError('Incorrect password');
        return;
      }

      // If credentials are correct, display welcome message and redirect
      const { name } = userData;
      alert(`Welcome to Crews Control, ${name}!`);
      navigate('/employee'); // Redirects to employee page
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Crews Control Logo" className="logo" />
      <h2 className="login-heading">Welcome To Crews Control</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="login-button" type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;