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
    }
  }, [habits, goals, selectedDate]);

  if (goals === null || habits === null) {
    return <h2>Loading...</h2>;
  }

  console.log(goals)

  //
  // Functionality to the calendar
  //

  // Function to check if a date is within the current week (Monday to Sunday)
  const isDateInCurrentWeek = (dateToCheck) => {
    const today = new Date(); // Get today's date
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Start of the week on Monday
    const end = endOfWeek(today, { weekStartsOn: 1 }); // End of the week on Sunday
    return isWithinInterval(dateToCheck, { start, end });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date); // Update the selected date
  };


  //
  // Functionality to update
  //

  // Handle habit check update
  const updateHabit = (habitId, isChecked) => {
    console.log(habitId);
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

      {/* Display habits related to the goal */}
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
                    checked={habitStatus[habitObj.habit._id] || false} // Ensure habit status is managed locally
                    onChange={() => {
                      // Toggle the habit check status
                      const newStatus = !habitStatus[habitObj.habit._id];
                      setHabitStatus((prevStatus) => ({
                        ...prevStatus,
                        [habitObj.habit._id]: newStatus,
                      }));
                      updateHabit(habitObj.habit._id, newStatus); // Update API
                    }}
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
              onClick={() => handleSubmit(selectedDate)}
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