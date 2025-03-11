import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from 'react-icons/fa';
import { API_URL } from "../../config/api";


function ListHabits({ deleteHabit, fetchHabits, habits }) {

  const handleDelete = async (habitId) => {
    await deleteHabit(habitId)
    await fetchHabits()
  };


  useEffect(() => {
    fetchHabits();
  }, []);


  // Loading items
  if (habits === null) {
    return (
      <h2 className="text-center mt-20 text-xl text-blue-700 font-bold">Loading...</h2>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-2xl rounded-3xl border-4 border-blue-300">
      <h1 className="text-3xl font-bold mb-4 text-purple-800 font-alice">
        Habits Page
      </h1>
      <Link
        to="/create-habit"
        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Create New Habit
      </Link>
  
      {!habits || habits.length === 0 ? (
        <div className="mt-6 text-gray-600 italic">
          No habits are created yet. Create one now! :)
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {habits.map((habit) => (
            <li
              key={habit._id}
              className="p-4 bg-white rounded-xl shadow-md border-2 border-purple-100 transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Link
                to={`/habits/${habit._id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {habit.title}
              </Link>
              <div className="flex flex-wrap space-x-3 mt-2">
                <button
                  onClick={() => handleDelete(habit._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-full flex items-center space-x-2 hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
                <Link
                  to={`/habits/edit/${habit._id}`}
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

export default ListHabits;