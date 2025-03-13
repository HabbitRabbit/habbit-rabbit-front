import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser, isLoggedIn } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, requestBody);
      console.log('JWT token', response.data.authToken);

      storeToken(response.data.authToken);
      await authenticateUser();
    } catch (error) {
      const errorDescription = error.response?.data?.message || 'An error occurred';
      setErrorMessage(errorDescription);
    }
  };

  if (isLoggedIn) {
    navigate("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Login</h1>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition duration-300">
            Login
          </button>
        </form>
        {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account yet? <Link to={"/signup"} className="text-purple-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;