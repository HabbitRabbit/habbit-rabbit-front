import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import CreateGoal from "../components/CreateGoal";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from 'react-icons/fa';

function Dashboard({ goals, fetchGoals, deleteGoal }) {

  const navigate = useNavigate();

  const handleDelete = async (goalId) => {
    await deleteGoal(goalId);
    await fetchGoals();
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-2xl rounded-3xl border-4 border-blue-300">
      <h1 className="text-3xl font-bold mb-4 text-purple-800 font-alice">
        Dashboard Goal Page
      </h1>

      <Link to="/create-goal" className="button bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
    Create New Goal
    </Link>

      {!goals || !goals.length ? (
        <div className="mt-6 text-gray-600 italic">
          No goals are created yet. Create one now! :)
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {goals.map((goal) => (
            <li
              key={goal._id}
              className="p-4 bg-white rounded-xl shadow-md border-2 border-purple-100 transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Link
                to={`/goals/${goal._id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {goal.name}
              </Link>
              <div className="flex space-x-3 mt-2">
              <button
                onClick={() => handleDelete(goal._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-full flex items-center space-x-2 hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
              <Link
                to={`/goals/edit/${goal._id}`}
                className="bg-purple-500 text-white py-1 px-3 rounded-full flex items-center space-x-2 hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-110"
              >
                <FaEdit />
                <span>Edit</span>
              </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;