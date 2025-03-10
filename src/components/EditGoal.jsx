import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

function EditGoal() {
  const [name, setName] = useState("");
  const [targetFrequency, setTargetFrequency] = useState(0);
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [habits, setHabits] = useState([]);  // State for available habits
  const [selectedHabits, setSelectedHabits] = useState([]);  // State for selected habits

  const navigate = useNavigate();
  const { goalId } = useParams()


  //Fetch the habits
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
          const habitIds = goal.habits.map(habit => habit.habit._id); // Extract habit IDs
          setSelectedHabits(habitIds);
        })
        .catch((error) => console.error("Error fetching goal data:", error));
    }
  }, [goalId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedGoal = {
        name,
        targetFrequency,
        period,
        startDate,
        endDate,
        habits: selectedHabits.map(id => ({ habit: id }))
      };

      await axios.patch(`${API_URL}/api/goals/${goalId}`, updatedGoal, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("Goal updated successfully");

      navigate(`/goals/${goalId}`); // Navigate or perform some action after update

    } catch (error) {
      console.error("There was an error updating the goal!", error);
    }
  };

  // Transform habits data for Select options
  const habitOptions = habits.map((habit) => ({
    label: habit.title,
    value: habit._id,
  }));

  return (
    <div className="bg-gray-50 p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Edit Goal</h2>
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
          <label className="block text-gray-700">Select Habits:</label>
          <Select
            isMulti
            options={habitOptions}
            value={habitOptions.filter(option => selectedHabits.includes(option.value))}
            onChange={(selectedOptions) => setSelectedHabits(selectedOptions.map(option => option.value))}
            className="mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditGoal;