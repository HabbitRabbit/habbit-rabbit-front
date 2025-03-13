import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/Habbit-logo-alone.png"
import { Link } from "react-router-dom";



function HomePage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Link to="/login">
       <img src={logo} alt="Habbit Rabbit Logo" className="w-80 mb-8 rounded-2xl shadow-lg" />
       </Link>
      <h1 className="text-5xl font-bold text-purple-900 mb-7 drop-shadow-md">Welcome to Habbit Rabbit</h1>
      <Link
        to="/login"
        className="bg-white text-purple-800 py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Go to Login
      </Link>
      <Link to="/about" className="mt-5 text-purple-600 hover:text-purple-800 transition duration-300 italic">
        Get to know us
      </Link>
    </div>
    );
  }

export default HomePage