import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { endOfWeek, startOfWeek, isWithinInterval } from "date-fns";
import { es } from "react-day-picker/locale";
import axios from "axios";
import "react-day-picker/dist/style.css";

const WeeklyView = ({ habits, fetchHabits, goals, fetchGoals }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitStatus, setHabitStatus] = useState({});
  const [localHabitStatus, setLocalHabitStatus] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [habitsToCheck, setHabitsToCheck] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchGoals();
      await fetchHabits();
      // const { data } = await axios.get(`${API_URL}/api/progress`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //   },
      // });
      // setProgressData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (habits && goals) {
  //     const initialStatus = {};
  //     console.log(habits)
  //     // habits.forEach((habit) => {
  //     //   initialStatus[habit._id] = habit.completedDates?.includes(selectedDate.toDateString()) || false;
  //     // });
  //     setHabitStatus(initialStatus);
  //     setLocalHabitStatus(initialStatus);

  //   }
  // }, [habits, goals, selectedDate]);

  if (loading || goals === null || habits === null) {
    return <h2>Loading...</h2>;
  }

  const isDateInCurrentWeek = (dateToCheck) => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return isWithinInterval(dateToCheck, { start, end });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleHabitCheck = async (goalId) => {
    try {
      // /goals/:goalId

      const goal = goals.find(curr => curr._id === goalId)


      const updatedGoal = {...goal, habits:  goal.habits.map((habit) =>
        habitsToCheck.includes(String(habit._id))
       ? { ...habit, achievedCount: habit.achievedCount + 1 }
       : habit
   ) }



       await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/goals/checkHabit/${goalId}`,
        {goal:updatedGoal}
      );
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleHabitSelect = (e, habit) => {
    
    if (e.target.checked) {
      setHabitsToCheck(prev => [...prev, habit]);
    } else {
      setHabitsToCheck((prev) => prev.filter((curr) => curr !== habit));
    }
  };


  console.log(habitsToCheck);
  // const handleHabitChange = (habitId, isChecked) => {
  //   setLocalHabitStatus((prevStatus) => ({
  //     ...prevStatus,
  //     [habitId]: isChecked,
  //   }));
  // };

  const handleSubmit = async () => {
    try {
      await Promise.all(
        Object.keys(localHabitStatus).map(async (habitId) => {
          const isChecked = localHabitStatus[habitId];
          await updateHabit(habitId, isChecked);
        })
      );
      await fetchGoals();
      await fetchHabits();
    } catch (error) {
      console.error("Error updating habits:", error);
    }
  };

  const updateHabit = async (habitId, isChecked) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/habits/${habitId}/check`,
        { check: isChecked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("Habit check updated:", response.data);
    } catch (err) {
      console.error("Error updating habit check:", err);
    }
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
        footer={
          selectedDate
            ? `Selected: ${selectedDate.toLocaleDateString()}`
            : "Pick a day."
        }
      />

      <div>
        <h3>Habits for {selectedDate.toLocaleDateString()}</h3>
        {goals.map((goal) => (
          <div key={goal._id}>
            <p>
              GOAL NAME: {goal.name} (Required: {goal.requiredAchievedCount},
              Remaining: {goal.remainingAchievedCount})
            </p>
            <ul>
              {goal.habits.map((habitObj) => {
                const progress = progressData.find(
                  (p) =>
                    p.habitId === habitObj.habit._id && p.goalId === goal._id
                );
                return (
                  habitObj.habit && (
                    <li key={habitObj._id} className="flex items-center my-2">
                      <input
                        type="checkbox"
                        // checked={localHabitStatus[habitObj.habit._id] || false}
                        onChange={(e) => handleHabitSelect(e, habitObj._id)}
                        // onChange={() => handleHabitChange(habitObj.habit._id, !localHabitStatus[habitObj.habit._id])}
                      />

                      
                      <span className="ml-2">
                        {habitObj.habit.title} - Completed:{" "}
                        {progress?.achievedCount || 0}
                      </span>
                    </li>
                  )
                );
              })}
            </ul>
            <button
                        className="border-2 border-amber-900 hover:bg-amber-600 transition-all ease-in-out 1s"
                        onClick={() => handleHabitCheck(goal._id)}
                      >
                        complete todays habits
                      </button>
          </div>
        ))}

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
