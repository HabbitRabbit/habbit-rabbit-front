import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { endOfWeek, startOfWeek, isWithinInterval } from "date-fns";
import { es } from "react-day-picker/locale";
import axios from "axios";
import "react-day-picker/dist/style.css";
import { API_URL } from "../../config/api";

const WeeklyView = ({ habits, fetchHabits, goals, fetchGoals }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitStatus, setHabitStatus] = useState({});
  const [localHabitStatus, setLocalHabitStatus] = useState({}); // Add a state to track changes locally

  useEffect(() => {
    fetchGoals();
    fetchHabits();
  }, []);

  // Initialize habit status when goals and habits are available
  useEffect(() => {
    if (habits && goals) {
      const initialStatus = {};
      habits.forEach((habit) => {
        initialStatus[habit._id] = habit.completedDates?.includes(selectedDate.toDateString()) || false; // default to checked state
      });
      setHabitStatus(initialStatus);
      setLocalHabitStatus(initialStatus); // Also initialize localHabitStatus
    }
  }, [habits, goals, selectedDate]);

  if (goals === null || habits === null) {
    return <h2>Loading...</h2>;
  }

  // Function to check if a date is within the current week (Monday to Sunday)
  const isDateInCurrentWeek = (dateToCheck) => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return isWithinInterval(dateToCheck, { start, end });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  // Handle habit check update, but don't immediately update the API
  const handleHabitChange = (habitId, isChecked) => {
    setLocalHabitStatus((prevStatus) => ({
      ...prevStatus,
      [habitId]: isChecked, // Only update the local state here
    }));
  };

  // Submit habits
  const handleSubmit = () => {
    // Update habits on the server
    Object.keys(localHabitStatus).forEach((habitId) => {
      const isChecked = localHabitStatus[habitId];
      updateHabit(habitId, isChecked); // Update API only when the button is clicked
    });
  };

  // Function to update habit status on the server
  const updateHabit = (habitId, isChecked) => {
    axios.patch(
      `${API_URL}/api/habits/${habitId}/check`,
      { check: isChecked },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then((response) => {
        console.log("Habit check updated:", response.data);
      })
      .catch((err) => {
        console.error("Error updating habit check:", err);
      });
  };

  return (
    <div>
      <h3>Current Week</h3>
      <DayPicker
        locale={es}
        selected={selectedDate}
        onDayClick={handleDayClick}
        mode="single"
        showOutsideDays={false}
        disabled={(date) => !isDateInCurrentWeek(date)}
        footer={selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : "Pick a day."}
      />

      <div>
        <h3>Habits for {selectedDate.toLocaleDateString()}</h3>
        {goals.map((goal) => (
          <div key={goal._id}>
            <p>GOAL NAME: {goal.name}</p>
            <ul>
              {goal.habits.map((habitObj) => (
                <li key={habitObj.habit._id} className="flex items-center my-2">
                  <input
                    type="checkbox"
                    checked={localHabitStatus[habitObj.habit._id] || false} // Manage status locally
                    onChange={() => handleHabitChange(habitObj.habit._id, !localHabitStatus[habitObj.habit._id])} // Only update local state
                  />
                  <span className="ml-2">habit name: {habitObj.habit.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {selectedDate.toDateString() === new Date().toDateString() && (
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit} // Submit all changes when clicked
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit Today's Habits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyView;