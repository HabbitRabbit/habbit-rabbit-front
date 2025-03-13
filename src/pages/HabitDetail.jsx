import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function HabitDetail() {

  const { habitId } = useParams();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits/${habitId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setHabit(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching habit details");
        setLoading(false);
      }
    };

    fetchHabit();
  }, [habitId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>);
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Habit Details</h1>
      {habit ? (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">{habit.title}</h2>
          <p className="mb-2"><strong>Description:</strong> {habit.description}</p>
          <p className="mb-6"><strong>Frequency:</strong> {habit.frequency}</p>
        </div>
      ) : (
        <div className="text-red-500 text-center">Habit not found</div>
      )}
      <div className="mt-6 text-center">
        <Link to={`/habits`} className="text-blue-600 hover:text-blue-800 transition duration-300">
          Back to Habits Page
        </Link>
      </div>
    </div>
  );
}

export default HabitDetail;