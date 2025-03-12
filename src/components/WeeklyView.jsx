import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  endOfWeek,
  startOfWeek,
  isWithinInterval,
  addDays,
  differenceInDays,
} from "date-fns";
import { es } from "react-day-picker/locale";
import axios from "axios";
import "react-day-picker/dist/style.css";
import { useParams } from "react-router-dom";

const WeeklyView = ({ habits, fetchHabits, goals, fetchGoals }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habitsToCheck, setHabitsToCheck] = useState([]);

  const { goalId } = useParams();

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
    return <h2>Loading...</h2>;
  }

  const isDateInCurrentWeek = (dateToCheck) => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return isWithinInterval(dateToCheck, { start, end });
  };

  // const isHabitCheckEligible = (habit, startDate, endDate) => {
  //   const frequencyDays =
  //     {
  //       "daily": 1,
  //       "two-days": 2,
  //       "three-days": 3,
  //     }[habit.frequency] || 1;

  //   let currentDate = new Date(startDate);
  //   while (currentDate <= endDate) {
  //     if (currentDate.toDateString() === selectedDate.toDateString()) {
  //       return true;
  //     }
  //     currentDate = addDays(currentDate, frequencyDays);
  //   }
  //   return false;
  // };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleHabitCheck = async (goalId) => {
    try {
      const goal = goals.find((curr) => curr._id === goalId);



      const updatedGoal = {
        ...goal,
        // PUNTO 4
        habits: goal.habits.map((habit) =>// ETIQUETA PUNTO 4
          /*(*/habitsToCheck.includes(String(habit._id)) //&& LOCAL STORAGE NOT EXIST)
            ? { ...habit, achievedCount: habit.achievedCount + 1 }
            : habit
        ),
      };

      // goals.requiredAchievedCount (días que hay que hacer check)
      // remainingAchievedCount (checks que quedan por hacer || remaining days) 
      // 
      // if achievedCount < remainingAchievedCount => podemos hacer check
      // else (check disabled)

      //  startDate 10/3 until 12/3 (currentDate) => 2 days (stored in: amount)
      //  if achievedCount < amount (doSomething)
      //  else (check disable)


      // const isHabitCheckEligible = (habit, startDate, endDate) => {
      //   // Calcula el número total de días desde startDate hasta la fecha seleccionada
      //   const amount = differenceInDays(selectedDate, new Date(startDate)) + 1; // +1 para incluir el día de inicio
      
      //   // Verifica si el hábito ha sido completado menos veces de lo que el periodo permite
      //   const achievedCount = habit.achievedCount || 0;
        
      //   // Si el número de veces que se ha completado es menor que el número de días transcurridos, es elegible para ser marcado
      //   return achievedCount < amount;
      // };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/goals/checkHabit/${goalId}`,
        { goal: updatedGoal }
      );
      
      // For each checked habit inside the goal, set local Storage with current date to TRUE
      goal.habits.map((habit) =>
      habitsToCheck.includes(String(habit._id))
        ? localStorage.setItem(`${goalId}-${habit._id}-${now.toLocaleString().split(",")[0]}`, true)
        : habit
    )
      
      // PUNTO 1
// 1. Guardar en local storage como true el goal+habit+date que se ha guardado
// localStorage.setItem(`${goalId}-${habit._id}-${now.toLocaleString().split(",")[0]}`, true)
// ej: localStorage.setItem("goalId-habitId-2025/03/12",true)
// 2. En el HTML, para cada habit checkbox, buscar su variable en local storage
// Si la variable existe y es "true", marcar el checkbox
// Sino, no marcarlo
// 3. Si todos los habits tienen local storage a true, poner el boton a disabled
// 4. En el punto ETIQUETA PUNTO 4, solo ejecutar el codigo de habit.achievedCount + 1 si el getlocal storage es false o no existe para el habit
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleHabitSelect = (e, habit) => {
    console.log("handleHabitSelect");
    
    if (e.target.checked) {
      setHabitsToCheck((prev) => [...prev, habit]);
    } else {
      setHabitsToCheck((prev) => prev.filter((curr) => curr !== habit));
    }
  };

  // const allHabitsCompleted = goals
  //   .find((goal) => goal._id === goalId)
  //   ?.habits.every((habitObj) => {
  //     const canCheck = isHabitCheckEligible(
  //       habitObj.habit,
  //       goal.startDate,
  //       goal.endDate
  //     );
  //     return !canCheck || habitsToCheck.includes(String(habitObj._id));
  //   });



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
        {goals
          .filter((goal) => goal._id === goalId)
          .map((goal) => (
            <div key={goal._id}>
              <p>
                GOAL NAME: {goal.name} (Required: {goal.requiredAchievedCount},
                Remaining Checks: {goal.remainingAchievedCount})
              </p>
              <ul>
                {goal.habits.map((habitObj) => {
                  const key = `${goalId}-${habitObj._id}-${now.toLocaleString().split(",")[0]}`

                  const isChecked = localStorage.getItem(key) ? true : false

                  // PUNTO 2
                  return (
                    habitObj.habit && (
                      <li key={habitObj._id} className="flex items-center my-2">
                        <input
                          type="checkbox"
                          disabled={isChecked}
                          onChange={(e) => handleHabitSelect(e, habitObj._id)}
                        />
                        <span className="ml-2">
                          {habitObj.habit.title} - Completed: {habitObj.achievedCount}
                        </span>
                      </li>
                    )
                  );
                })}
              </ul>
              {/* {allHabitsCompleted && (
                <div className="text-center mt-4">
                  <h3 className="text-green-600 font-bold">
                    You have completed all your habits for today!
                  </h3>
                </div>
              )} */
              
              // PUNTO 3
              }
              <div className="text-center mt-4">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => handleHabitCheck(goal._id)}
                >
                  Complete Today's Habits
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeeklyView;
