import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";


function ListHabits({}) {

    const [habits, setHabits] = useState(null);

    const fetchHabits = () => {
        axios
          .get(`${API_URL}/api/habits`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          .then((response) => {
            const habits = response.data;
            setHabits(habits);
          })
          .catch((error) => console.log(`Error: ${error}`));
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
        // <div className="flex flex-col justify-center items-center min-h-screen p-8 max-w-2xl mx-auto">
        <ul className="mt-15 space-y-2">
          {habits.map((habit) => (
            <li key={habit._id} className="p-4 bg-gray-100 rounded shadow-sm">
              <Link to={`/habits/${habit._id}`} className="text-blue-600 hover:underline">
              {habit.title}</Link>
            </li>
          ))}
        </ul>
    )
}

export default ListHabits;