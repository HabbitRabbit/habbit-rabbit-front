import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import EditGoal from "../components/EditGoal";

function GoalDetail({deleteGoal, goals, fetchGoals, fetchHabits, habits}) {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/goals/${goalId}`, {
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

   
    fetchGoal();
  }, [goalId]);
 console.log(goal)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-indigo-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">Goal Details</h1>
      {goal ? (
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">{goal.name}</h2>
          <p><strong>Target Frequency:</strong> {goal.targetFrequency}</p>
          <p><strong>Period:</strong> {goal.period}</p>
          <p><strong>Start Date:</strong> {new Date(goal.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : "Ongoing"}</p>
          
          <div className="mt-8 border-t pt-4">
            <p className="font-semibold mb-4 text-indigo-800"><strong>Habits: </strong></p>
            <div className="space-y-3">
              {goal.habits.map((habitObj) => {
                return (
                  <p key={habitObj.habit._id} className="bg-indigo-200 p-3 rounded-full text-center shadow-sm">
                    {habitObj.habit.title}: Frequency: {habitObj.habit.frequency}
                  </p>
                );
              })}
            </div>
          </div>

          <Link to={`/goals/edit/${goalId}`} className="block mt-6 text-center text-blue-600 hover:text-blue-800">
            Edit Goal
          </Link>
        </div>
      ) : (
        <div>Goal not found</div>
      )}
    </div>
  );
}

export default GoalDetail;