import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { API_URL } from "../../config/api";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';

function CalendarView({ habits, fetchHabits }) {
  const [date, setDate] = useState(new Date());

  console.log(habits);
  
  // Function to update CHECK
  function updateHabit(habitId, result) {
    axios.patch(`${API_URL}/api/habits/${habitId}/check`, { check: result }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
    .then(response => {
      console.log("Habit check updated:", response.data);
    })
    .catch(err => {
      console.error("Error updating habit check:", err);
    });
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  // Loading items 
  if (habits === null) {
    return <h2>Loading...</h2>;
  }

  const startOfWeek = date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  };

  const getWeekDates = startDate => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(startOfWeek(date));
  console.log(weekDates);
  console.log(habits);
  
  return (
    // <div className="calendar-container max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    //   <Calendar
    //     onChange={setDate}
    //     value={date}
    //     view="month"
    //     tileDisabled={({ activeStartDate, date, view }) =>
    //       view === 'month' && (date < startOfWeek(date) || date > weekDates[6])
    //     }
    //     className="mb-4"
    //   />
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
                    onChange={() => updateHabit(habit._id, day)}
                  />
                  <span className="ml-2">{habit.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
   
  );
}

export default CalendarView;