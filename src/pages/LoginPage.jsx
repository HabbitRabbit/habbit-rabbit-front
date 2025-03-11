// src/pages/LoginPage.jsx

import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { API_URL } from "../../config/api";


function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();

    const { storeToken, authenticateUser,isLoggedIn } = useContext(AuthContext)

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const requestBody = { email, password };
  
    try {
      const response = await axios.post(`${API_URL}/auth/login`, requestBody);
      // Request to the server's endpoint `/auth/login` returns a response
      // with the JWT string -> response.data.authToken
      console.log('JWT token', response.data.authToken);
  
      storeToken(response.data.authToken);
      // Verify the token by sending a request 
      // to the server's JWT validation endpoint.
      await authenticateUser();
      
   
    } catch (error) {
      const errorDescription = error.response?.data?.message || 'An error occurred';
      setErrorMessage(errorDescription);
    }
  };

if(isLoggedIn){
  navigate("/dashboard")
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <label className="block text-gray-700">Email:</label>
        <input 
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
          className="w-full mt-1 p-2 border border-gray-300 rounded"
        />

        <label className="block">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
          className="w-full mt-1 p-2 border border-gray-300 rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
      { errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p> }

      <p className="mt-6 text-center text-gray-600">Don't have an account yet? <Link to={"/signup"} className="text-blue-600 w-full hover:underline"> Sign Up</Link> </p>
      </div>
    </div>
  )
}

export default LoginPage;