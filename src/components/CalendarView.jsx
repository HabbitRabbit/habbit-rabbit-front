import { useEffect, useState } from "react";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import Loader from "./Loader";

function CalendarView({ habits, fetchHabits }) {
  const [date, setDate] = useState(new Date());
  const [today, setToday] = useState(new Date()); // Store today's date for comparison



  useEffect(() => {
    fetchHabits(); // Fetch habits when the component is mounted
  }, []);
  
  // Loading items 
  if (habits === null) {
    return <Loader />;
  }
  // Get start of the week (Sunday as the start of the week)
  const startOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust so that the week starts on Monday
    return new Date(start.setDate(diff));
  };

  // Get the full week from start of the week (7 days)
  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(startOfWeek(date));

  // Handle habit check update
  const updateHabit = (habitId, result) => {
    axios.patch(
      `${import.meta.env.VITE_API_URL}/api/habits/${habitId}/check`,
      { check: result },
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

  // Handle submit of today's habits
  const handleSubmit = (day) => {
    // Filter habits that are checked today (those that have completed on the day)
    const completedHabits = habits.filter((habit) =>
      habit.completedDates?.includes(day.toDateString())
    );
    console.log("Submitting today's habits: ", completedHabits);

    // You can perform the submission logic for these habits here
    completedHabits.forEach((habit) => {
      updateHabit(habit._id, true); // Assuming `true` indicates the habit is completed for today
    });
  };

  return (
    <div className="weekly-habits mt-4">
      <h2 className="text-2xl font-bold text-center mb-4">Weekly Habits</h2>
      {weekDates.map((day) => (
        <div key={day.toDateString()} className="day-container mb-4 p-4 bg-indigo-100 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">{day.toDateString()}</h3>
          <ul>
            {habits.map((habit) => (
              <li key={habit._id} className="flex items-center my-2">
                <input
                  type="checkbox"
                  checked={habit.completedDates?.includes(day.toDateString())}
                  onChange={() => updateHabit(habit._id, !habit.completedDates?.includes(day.toDateString()))}
                />
                <span className="ml-2">{habit.title}</span>
              </li>
            ))}
          </ul>

          {/* If the day is today, show the Submit button */}
          {day.toDateString() === today.toDateString() && (
            <div className="text-center mt-4">
              <button
                onClick={() => handleSubmit(day)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Submit Today's Habits
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CalendarView;