import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import CreateGoal from "../components/CreateGoal";
import { Link, useNavigate } from "react-router-dom";


function Dashboard({goals, fetchGoals, deleteGoal}) {
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate()

  const toggleFormView = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  
  const handleGoalCreation = () => {
    fetchGoals();
    setShowForm(false);
  };

  const handleDelete = async (goalId) => {
   await deleteGoal(goalId)
   await fetchGoals()
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Dashboard Goal Page</h1>
      <button onClick={toggleFormView} className="button bg-pink-400">
        {showForm ? "Hide Form" : "Click to Create new Goal"}
      </button>
      {showForm && <CreateGoal onGoalCreated={handleGoalCreation}/>}
      {!goals || !goals.length ? (
        <div className="mt-6 text-gray-600">
          No goals are created yet. Create one now! :)
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {goals.map((goal) => (
            <li key={goal._id} className="p-4 bg-gray-100 rounded shadow-sm">
              <Link to={`/goals/${goal._id}`} className="text-blue-600 hover:underline">
              {goal.name}</Link>
              <button
                onClick={() => handleDelete(goal._id)} 
                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
