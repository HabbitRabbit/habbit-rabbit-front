import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";


function IsPrivate({ children }) {

  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If the authentication is still loading 
  if (isLoading) return
  (<div className="flex items-center justify-center min-h-screen">
    <Loader />;
  </div>)

  if (!isLoggedIn) {
    // If the user is not logged in 
    console.log("I AM NOT LOGGED IN")
    return <Navigate to="/login" />;
  } else {
    // If the user is logged in, allow to see the page 
    return children;
  }
}

export default IsPrivate;