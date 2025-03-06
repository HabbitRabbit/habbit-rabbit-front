import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

function CreateGoal({ goalId, onGoalCreated }) {
  const [name, setName] = useState("");
  const [targetFrequency, setTargetFrequency] = useState(0);
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const { storeToken } = useContext(AuthContext);

  useEffect(() => {
    if (goalId) {
      // Fetch the existing goal data to pre-fill the form for editing
      axios.get(`${API_URL}/api/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const goal = response.data;
        setName(goal.name);
        setTargetFrequency(goal.targetFrequency);
        setPeriod(goal.period);
        setStartDate(goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : "");
        setEndDate(goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : "");
      })
      .catch((error) => console.error("Error fetching goal data:", error));
    }
  }, [goalId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("authToken");
      console.log(userToken)



      const decodedToken = JSON.parse(atob(userToken.split('.')[1])); // Decode JWT payload


      const userId = decodedToken._id; // Extract user ID from the token payload


        console.log(userId)

      const newGoal = {
        name,
        targetFrequency,
        period,
        startDate,
        endDate,
        createdBy: userId, // Set the createdBy field with the user's ID
        //TODO Check how habits are being sent
      };

      const response = await axios.post(`${API_URL}/api/goals`, newGoal, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("Goal created successfully:", response.data);
      // Reset form fields
      setName("");
      setTargetFrequency(0);
      setPeriod("daily");
      setStartDate("");
      setEndDate("");

      onGoalCreated();

      navigate('/dashboard');

    } catch (error) {
      console.error("There was an error saving the goal!", error);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">{goalId ? "Edit Goal" : "Create a New Goal"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700">
            Target Frequency:
            <input
              type="number"
              value={targetFrequency}
              onChange={(e) => setTargetFrequency(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700">
            Period:
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-gray-700">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {goalId ? "Save Changes" : "Create Goal"}
        </button>
      </form>
    </div>
  );
}

export default CreateGoal;