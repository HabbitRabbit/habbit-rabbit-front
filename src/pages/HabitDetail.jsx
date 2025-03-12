import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Habit Details</h1>
      {habit ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">{habit.title}</h2>
          <p><strong>Description:</strong> {habit.description}</p>
          <p><strong>Frequency:</strong> {habit.frequency}</p>
        </div>
      ) : (
        <div>Goal not found</div>
      )}
      <Link to={`/habits`} className="text-blue-600 hover:underline">
      Back to Habits Page</Link>
    </div>
  );
}

export default HabitDetail;