import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignupPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const requestBody = { email, password, name };

    axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
      .then((response) => {
        navigate('/login');
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      })
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Sign Up</h1>

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input 
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password:</label>
            <input 
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Confirm Password:</label>
            <input 
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Name:</label>
            <input 
              type="text"
              name="name"
              value={name}
              onChange={handleName}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition duration-300">
            Sign Up
          </button>
        </form>

        {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}

        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to={"/login"} className="text-purple-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
