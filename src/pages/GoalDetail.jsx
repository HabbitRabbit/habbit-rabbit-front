import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import EditGoal from "../components/EditGoal";

function GoalDetail({deleteGoal}) {
  const { goalId } = useParams(); // Retrieve the goal ID from URL parameters
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Goal Details</h1>
      {goal ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">{goal.name}</h2>
          <p><strong>Target Frequency:</strong> {goal.targetFrequency}</p>
          <p><strong>Period:</strong> {goal.period}</p>
          <p><strong>Start Date:</strong> {new Date(goal.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : "Ongoing"}</p>
          {/* TODO Add the habits here + fix na */}

          <div><EditGoal goalId={goalId}/></div>
        </div>
      ) : (
        <div>Goal not found</div>
      )}
    </div>
  );
}

export default GoalDetail;