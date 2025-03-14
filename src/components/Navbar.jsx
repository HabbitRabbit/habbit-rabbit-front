import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {

  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-[#6c90ec] via-[#7d99db] to-[#7695dd] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-800 transition duration-300 ease-in-out font-semibold">Home</Link>
          <Link to="/about" className="hover:text-purple-800 transition duration-300 ease-in-out  font-semibold">About</Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-purple-800 transition duration-300 ease-in-out  font-semibold">My Goals</Link>
              <Link to="/create-goal" className="hover:text-purple-800 transition duration-300 ease-in-out  font-semibold">Add Goal</Link>
              <Link to="/habits" className="hover:text-purple-800 transition duration-300 ease-in-out font-semibold">My Habits</Link>
              <Link to="/create-habit" className="hover:text-purple-800 transition duration-300 ease-in-out font-semibold">Add Habit</Link>
              <button
                onClick={logOutUser}
                className="bg-white hover:bg-gray-100 text-purple-800 py-2 px-4 rounded-full transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-purple-800 py-2 px-4 rounded-full transition duration-300"
            >
              Login/Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;