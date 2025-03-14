import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import {
  endOfWeek,
  startOfWeek,
  isWithinInterval,
} from "date-fns";
import { es } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import { notifySucces } from "../data/data";
import Loader from "./Loader";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import GrowHabbit from "./GrowHabbit";

const WeeklyView = ({ habits, fetchHabits, goals, fetchGoals }) => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habitsToCheck, setHabitsToCheck] = useState([]);

  const { goalId } = useParams();

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => { //set the size of screen in a variable
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const now = new Date();
  const fetchGoal = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/goals/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setGoal(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching goal details");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchGoals();
      await fetchHabits();

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchGoal();
  }, [goalId]);

  if (loading || goals === null || habits === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>)
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

      notifySucces(width) // Alert with toastify to notify sumbit button
      const goal = goals.find((curr) => curr._id === goalId);
      const updatedGoal = {
        ...goal,

        habits: goal.habits.map(
          (
            habit
          ) =>
            habitsToCheck.includes(String(habit._id)) && !localStorage.getItem(`${goalId}-${habit._id}-${now}`)
              ? { ...habit, achievedCount: habit.achievedCount + 1 }
              : habit
        ),
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/goals/checkHabit/${goalId}`,
        { goal: updatedGoal }
      );

      // For each checked habit inside the goal, set local Storage with current date to TRUE
      goal.habits.map((habit) =>
        habitsToCheck.includes(String(habit._id))
          ? localStorage.setItem(
            `${goalId}-${habit._id}-${now.toLocaleString().split(",")[0]}`,
            true
          )
          : habit
      );

      fetchGoals();
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleHabitSelect = (e, habit) => {
    if (e.target.checked) {
      setHabitsToCheck((prev) => [...prev, habit]);
    } else {
      setHabitsToCheck((prev) => prev.filter((curr) => curr !== habit));
    }
  };

  const allHabitsCompleted = goals
    .find((goal) => goal._id === goalId)
    ?.habits.every((habitObj) => {
      const key = `${goalId}-${habitObj._id}-${now.toLocaleString().split(",")[0]
        }`;
      return localStorage.getItem(key) === "true";
    });

  let amount = 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-blue-800 mb-4 mt-4 text-center">Current Week</h3>
      <div className="flex justify-center mb-6">
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
          className="mb-6 justify-center"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-blue-700 mb-3">
          Habits for {selectedDate.toLocaleDateString()}
        </h3>
        {goals
          .filter((goal) => goal._id === goalId)
          .map((goal) => (
            <div key={goal._id} className="mb-6">
              <p className="text-lg mb-2">
                {goal.name}
              </p>
              <ul className="list-disc pl-5">
                {goal.habits.map((habitObj) => {
                  const key = `${goalId}-${habitObj._id}-${now.toLocaleString().split(",")[0]}`;
                  const isChecked = localStorage.getItem(key) ? true : false;

                  //Logic for the progress bar
                  const totalAchievedCount = goal.habits.reduce((sum, habitObj) => {
                    return sum + habitObj.achievedCount;
                  }, 0);

                  const totalRequiredCount = goal.habits.reduce((sum, habitObj) => {
                    return sum + goal.requiredAchievedCount;
                  }, 0);

                  amount = (totalAchievedCount / totalRequiredCount) * 100

                  return (
                    habitObj.habit && (
                      <li key={habitObj._id} className="flex items-center my-2">
                        <input
                          type="checkbox"
                          disabled={isChecked}
                          onChange={(e) => handleHabitSelect(e, habitObj._id)}
                          className="mr-2"
                        />
                        <span className={`ml-2 ${isChecked ? 'line-through text-gray-500' : ''}`}>
                          {habitObj.habit.title}
                        </span>
                      </li>
                    )
                  );
                })}
              </ul>
              <p className="mt-6 mb-3">Progress... </p>
              <div className="flex justify-center mb-6">
                <Box sx={{ width: '80%', maxWidth: '1000px', display: 'flex', alignItems: 'center' }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(amount, 100)}  // Ensure the value does not exceed 100
                    sx={{
                      height: '20px', // Custom height
                      borderRadius: '10px', // Rounded corners
                      backgroundColor: '#e0e0e0', // Light background for the bar
                      width: '100%', // Set a width to ensure proper size
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: goal.color, // Color chosen from Goal
                        borderRadius: '10px', // Rounded corners for the bar
                      },
                    }}
                  />
                </Box>
                {amount === 100 && (
                  <p className="text-center">
                    🎉 🐰 🎉
                  </p>
                )}
              </div>
              <div className="mt-2 flex justify-center">
                <GrowHabbit amount={amount} />
              </div>
              {allHabitsCompleted ? (
                <div className="text-center mt-4">
                  <h3 className="text-green-600 font-bold">
                    You have completed all your habits for today!
                  </h3>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => handleHabitCheck(goal._id)}
                  >
                    Complete Today's Habits
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeeklyView;
