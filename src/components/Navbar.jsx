import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  //  Update the rendering logic to display different content
  //  depending on whether the user is logged in or not

  return (
    <nav className="fixed top-0 z-50 w-screen bg-black text-white p-4">
      <div className="flex space-x-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link to="/">Home</Link>
          <br></br>
          <Link to="/about">About</Link>
          <br></br>

          {isLoggedIn && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <br></br>
              <Link to="/create-goal">Create a new goal</Link>
              <br></br>
              <Link to="/habits">Habits</Link>
              <br></br>
              <Link to="/create-habit">Create habit</Link>
              <br />
              <button onClick={logOutUser} className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-4 rounded-full transition duration-300">
                Logout
                </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-4 rounded-full transition duration-300"> Login/Signup </Link>
              <br />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
