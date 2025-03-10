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
  }, []);

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    // Initialize habit status when goals and habits are available
    if (habits && goals) {
      const initialStatus = {};
      habits.forEach((habit) => {
        initialStatus[habit._id] = false; // default to unchecked
      });
      setHabitStatus(initialStatus);
    }
  }, [habits, goals]);

  if (goals === null || habits === null) {
    return <h2>Loading...</h2>;
  }
  

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

  // Handle habit check update
  const updateHabit = (habitId, isChecked) => {
    // Update local status first
    setHabitStatus((prevStatus) => ({
      ...prevStatus,
      [habitId]: isChecked,
    }));

    // Send update request to API
    axios.patch(
      `${API_URL}/api/habits/${habitId}/check`,
      { check: isChecked, date: selectedDate.toDateString() }, // You may also include the specific date here
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
  const handleSubmit = () => {
    const completedHabits = habits.filter((habit) => habitStatus[habit._id]);
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
        disabled={(date) => !isDateInCurrentWeek(date)} // Disable days outside the current week
        footer={selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : "Pick a day."}
      />

      {/* Display habits related to the goal */}
      <div>
        <h3>Habits for {selectedDate.toLocaleDateString()}</h3>
        {goals.map((goal) => (
            <div>
              <p key={goal._id}>GOAL NAME: {goal.name}</p>
              <p>{goal.habits.map((habitObj) => {
                return (
                  // <p key={habitObj.habit._id}>
                  //   habit name: {habitObj.habit.title}
                  // </p>
                  <li kkey={habitObj.habit._id} className="flex items-center my-2">
                  <input
                    type="checkbox"
                    checked={habitStatus[habitObj._id] || false}
                    onChange={() => updateHabit(habitObj._id, !habitStatus[habitObj._id])}
                  />
                  <span className="ml-2">habit name: {habitObj.habit.title}</span>
                </li>
                );
              })}</p>
            </div>
            
            
              
              
         )) }
        {/* {habits.map((habit) => (
          <li key={habit._id} className="flex items-center my-2">
            <input
              type="checkbox"
              checked={habitStatus[habit._id] || false}
              onChange={() => updateHabit(habit._id, !habitStatus[habit._id])}
            />
            <span className="ml-2">{habit.title}</span>
          </li>
        ))} */}

        {/* Button to submit today's habits */}
        {selectedDate.toDateString() === new Date().toDateString() && (
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
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