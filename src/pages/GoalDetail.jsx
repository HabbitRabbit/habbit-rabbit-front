import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import EditGoal from "../components/EditGoal";
import WeeklyView from "../components/WeeklyView";
import Loader from "../components/Loader";


function GoalDetail({ deleteGoal, goals, fetchGoals, fetchHabits, habits }) {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoal = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setGoal(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching goal details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [goalId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
    <Loader />
    </div>
)
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-indigo-50 shadow-2xl rounded-3xl">
            <div className="flex justify-between items-center mb-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">Goal Details</h1>
      <Link to={`/goals/edit/${goalId}`} className="text-blue-600 hover:text-blue-800 transition duration-300">
          Edit Goal
        </Link>
        </div>
      {goal ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">{goal.name}</h2>
          <p className="mb-2"><strong>Start Date:</strong> {new Date(goal.startDate).toLocaleDateString()}</p>
          <p className="mb-6"><strong>End Date:</strong> {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : "Ongoing"}</p>
          
          <div className="border-t pt-4">
            <p className="font-semibold mb-4 text-indigo-800"><strong>Habits: </strong></p>
            <div className="space-y-4">
              {goal.habits.map((habitObj) => (
                <p key={habitObj.habit._id} className="bg-indigo-200 p-3 rounded-lg text-center shadow-sm">
                  {habitObj.habit.title}. <br /> Frequency: {habitObj.habit.frequency}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <WeeklyView goals={goals} fetchGoals={fetchGoals} habits={habits} fetchHabits={fetchHabits} />
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 text-red-600">Goal not found</div>
      )}
    </div>
  );
}

export default GoalDetail;