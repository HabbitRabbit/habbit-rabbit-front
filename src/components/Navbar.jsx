import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 z-50 w-full bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">My Goals</Link>
              <Link to="/create-goal" className="hover:text-gray-300">Add Goal</Link>
              <Link to="/habits" className="hover:text-gray-300">My Habits</Link>
              <Link to="/create-habit" className="hover:text-gray-300">Add Habit</Link>
              <button 
                onClick={logOutUser} 
                className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-4 rounded-full transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-4 rounded-full transition duration-300"
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