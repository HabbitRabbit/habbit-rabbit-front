import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from 'react-icons/fa';

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
      <h2 className="text-center mt-20 text-xl text-teal-700 font-bold">Loading...</h2>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-teal-100 via-blue-100 to-teal-200 shadow-xl rounded-3xl border-4 border-green-200">
      <h1 className="text-3xl font-bold mb-4 text-teal-800 font-alice">
        Habits Page
      </h1>
      <Link
        to="/create-habit"
        className="bg-teal-400 hover:bg-teal-500 text-white py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
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
              className="p-4 bg-white rounded-xl shadow-md border border-teal-100 transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Link
                to={`/habits/${habit._id}`}
                className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
              >
                {habit.title}
              </Link>
              <div className="flex flex-wrap space-x-3 mt-2">
                <button
                  onClick={() => handleDelete(habit._id)}
                  className="bg-red-400 text-white py-1 px-3 rounded-full flex items-center space-x-2 hover:bg-red-500 transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
                <Link
                  to={`/habits/edit/${habit._id}`}
                  className="bg-teal-400 text-white py-1 px-3 rounded-full flex items-center space-x-2 hover:bg-teal-500 transition duration-300 ease-in-out transform hover:scale-110"
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