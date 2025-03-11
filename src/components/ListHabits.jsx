import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";


function ListHabits({ deleteHabit, fetchHabits, habits }) {

  // const [habits, setHabits] = useState(null);

  // const fetchHabits = () => {
  //     axios
  //       .get(`${API_URL}/api/habits`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //       })
  //       .then((response) => {
  //         const habits = response.data;
  //         setHabits(habits);
  //       })
  //       .catch((error) => console.log(`Error: ${error}`));
  //   };

  const handleDelete = async (habitId) => {
    await deleteHabit(habitId)
    await fetchHabits()
  };


  useEffect(() => {
    fetchHabits();
  }, []);


  //loading items 
  if (habits === null) {
    return (
      <h2>loading</h2>
    )
  }


  return (
    <div>
      {!habits || habits.length ? (<div className="mt-6 text-gray-600 italic">
        <Link to="/create-habit" className="button bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          Create New Habit
        </Link>
        <p className="mt-7">No goals are created yet. Create one now!</p>
      </div>
      ) : (<ul className="mt-15 space-y-2">
        {habits.map((habit) => (
          <li key={habit._id} className="p-4 bg-gray-100 rounded shadow-sm">
            <Link to={`/habits/${habit._id}`} className="text-blue-600 hover:underline">
              {habit.title}</Link>
            <button
              onClick={() => handleDelete(habit._id)}
              className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
            >
              Delete
            </button>
            <Link to={`/habits/edit/${habit._id}`}>
              <button className="btn-green text-sm md:text-xl hover:bg-green-800" >Edit</button>
            </Link>
          </li>
        ))}
      </ul>)}
    </div>
  )
}

export default ListHabits;