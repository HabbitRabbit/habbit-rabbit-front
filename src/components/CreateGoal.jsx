import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { animatedComponents } from "../data/data";
import { colorOptions, dot, colourStyles } from "../data/data";

import Select from "react-select";

function CreateGoal({ goalId, fetchGoals, fetchHabits, onGoalCreated }) {


  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(() => {
    // Set the start date to today by default
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 30); // Add 30 days to today
    return today.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  });
  const [color, setColor] = useState("#0000FF");

  const [habits, setHabits] = useState([])
  const [selectedHabits, setSelectedHabits] = useState([]);

  const navigate = useNavigate();

  const { storeToken } = useContext(AuthContext);


  // const associateHabitWithGoal = async (habitId, goalId, userId) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/api/progress`, {
  //       habitId,
  //       goalId,
  //       userId,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //       },
  //     });
  //     console.log("Progress entry created:", response.data);
  //   } catch (error) {
  //     console.error("Error creating progress entry:", error);
  //   }
  // };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/habits/`, {
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
      axios.get(`${import.meta.env.VITE_API_URL}/api/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then((response) => {
          const goal = response.data;
          setName(goal.name);
          setStartDate(goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : "");
          setEndDate(goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : "");
          // Set selected habits if the goal has habits
          if (goal.habits && goal.habits.length > 0) {
            setSelectedHabits(goal.habits.map((habit) => habit._id)); // Set the habit IDs
          }
        })
        .catch((error) => console.error("Error fetching goal data:", error));
    }
  }, [goalId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Selected Habits:", selectedHabits);
    try {
      const userToken = localStorage.getItem("authToken");
      const decodedToken = JSON.parse(atob(userToken.split('.')[1])); // Decode JWT payload
      const userId = decodedToken._id; // Extract user ID from the token payload

      const newGoal = {
        name,
        startDate,
        endDate,
        color,
        habits: selectedHabits.map((habitId) => ({ habit: habitId, achievedCount: 0 })), // Map selected habit IDs to the habit objects
        createdBy: userId,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/goals`, newGoal, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("Goal created successfully:", response.data);
      const createdGoal = response.data;

    // // Create progress entries for each habit associated with the new goal
    // await Promise.all(selectedHabits.map((habitId) => 
    //   associateHabitWithGoal(habitId, createdGoal._id, userId)
    // ));

    console.log("Goal created successfully:", createdGoal);

    // Reset form fields
    setName("");
    setStartDate("");
    setEndDate("");
    setColor("");
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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-2xl rounded-3xl border-4 border-blue-300">
      <h2 className="text-3xl font-bold mb-4 text-purple-800 font-alice">
        {goalId ? "Edit Goal" : "Create a New Goal"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">
            Name:
            <input
              type="text"
              placeholder="Enter a name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
            />
          </label>
        </div>
        <div>
              <label className="block text-gray-700">Color:</label>
              <Select
                value={color ? colorOptions.find((option) => option.value === color) : null}
                onChange={(selectedOption) => setColor(selectedOption.value)}
                options={colorOptions}
                styles={colourStyles}
                className="mt-1"
              />
            </div>
        <div>
          <label className="block text-gray-700">
            Select habits:
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
          </label>
        </div>
        <button
          type="submit"
          disabled={selectedHabits.length === 0} // Disable button if no habit is selected
          className={`bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${selectedHabits.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {goalId ? "Save Changes" : "Create Goal"}
        </button>
      </form>
    </div>
  );
}

export default CreateGoal;