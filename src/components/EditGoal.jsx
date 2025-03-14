import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { animatedComponents } from "../data/data";
import Select from "react-select";
import { colorOptions, dot, colourStyles } from "../data/data";


function EditGoal() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState("");
  const [habits, setHabits] = useState([]); // State for available habits
  const [selectedHabits, setSelectedHabits] = useState([]); // State for selected habits

  const navigate = useNavigate();
  const { goalId } = useParams();

  //Fetch the habits
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/habits/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setHabits(response.data); // Set all habits
      })
      .catch((error) => console.log(`Error fetching habits: ${error}`));
  }, []);

  useEffect(() => {
    if (goalId) {
      // Fetch the existing goal data to pre-fill the form for editing
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/goals/${goalId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((response) => {
          const goal = response.data;
          setName(goal.name);
          setStartDate(
            goal.startDate
              ? new Date(goal.startDate).toISOString().split("T")[0]
              : ""
          );
          setEndDate(
            goal.endDate
              ? new Date(goal.endDate).toISOString().split("T")[0]
              : ""
          );
          setColor(response.data.color);
          const habitIds = goal.habits.map((habit) => habit.habit._id); // Extract habit IDs
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
        startDate,
        endDate,
        color,
        habits: selectedHabits.map((id) => ({ habit: id })),
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/goals/${goalId}`,
        updatedGoal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

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
    <div className="flex justify-center items-center min-h-screen p-8">
      <div className="p-1 rounded-lg w-full md:w-3/5">
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
          <label className="block text-gray-700">Color:</label>
          <Select
            value={
              color
                ? colorOptions.find((option) => option.value === color)
                : null
            }
            onChange={(selectedOption) => setColor(selectedOption.value)}
            options={colorOptions}
            styles={colourStyles}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">Select Habits:</label>
          <Select
            isMulti
            options={habitOptions}
            components={animatedComponents}
            value={habitOptions.filter((option) =>
              selectedHabits.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              setSelectedHabits(selectedOptions.map((option) => option.value))
            }
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
    </div>
    </div>
  );
}

export default EditGoal;
