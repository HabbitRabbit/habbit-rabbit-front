import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import CreateGoal from "../components/CreateGoal";

function Dashboard() {
  const [goals, setGoals] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/goals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const goals = response.data;
        setGoals(goals);
      })
      .catch((error) => console.log(`Error: ${error}`));
  }, []);

  return (
<div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Dashboard Goal Page</h1>
      <CreateGoal />
      {goals === null ? (
        <div className="mt-6 text-gray-600">No goals are created yet. Create one now! :)</div>
      ) : (
        <ul className="mt-6 space-y-2">
          {goals.map((goal) => (
            <li key={goal._id} className="p-4 bg-gray-100 rounded shadow-sm">
              {goal.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;