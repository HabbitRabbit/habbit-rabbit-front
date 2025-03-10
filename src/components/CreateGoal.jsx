import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function CreateGoal({ goalId, fetchGoals, fetchHabits, onGoalCreated }) {


  const [name, setName] = useState("");
  const [targetFrequency, setTargetFrequency] = useState(0);
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [habits, setHabits] = useState([])
  const [selectedHabits, setSelectedHabits] = useState("");

  const navigate = useNavigate();

  const { storeToken } = useContext(AuthContext);


  //useEffect to get the habits
  // useEffect(() => {
  //   fetchHabits() dont know why this is not working
  // }, []) 

  useEffect(() => {
    axios.get(`${API_URL}/api/habits/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then(response => {
        setHabits(response.data); // Set all habits
      })
      .catch((error) => console.log(`Error fetching habits: ${error}`));
  }, []);



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
          // Set selected habits if the goal has habits
          if (goal.habits && goal.habits.length > 0) {
            setSelectedHabits(goal.habits.map((habit) => habit.habit)); // Set the habit IDs
          }
        })
        .catch((error) => console.error("Error fetching goal data:", error));
    }
  }, [goalId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("authToken");
      const decodedToken = JSON.parse(atob(userToken.split('.')[1])); // Decode JWT payload
      const userId = decodedToken._id; // Extract user ID from the token payload

      const newGoal = {
        name,
        targetFrequency,
        period,
        startDate,
        endDate,
        habits: selectedHabits.map((habitId) => ({ habit: habitId, achievedCount: 0 })), // Map selected habit IDs to the habit objects
        createdBy: userId,
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
      setSelectedHabits([]);


      navigate('/dashboard');

    } catch (error) {
      console.error("There was an error saving the goal!", error);
    }
  };

  const habitOptions = habits.map((habit) => ({
    label: habit.title,
    value: habit._id,
  }));

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
        <div>
          <label className="block text-gray-700">
            Select habits:
            <Select
              isMulti
              options={habitOptions}
              value={habitOptions.filter((option) =>
                selectedHabits.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                setSelectedHabits(selectedOptions.map((option) => option.value))
              }
              className="mt-1"
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