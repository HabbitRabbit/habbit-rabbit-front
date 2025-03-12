import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './index.css'

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Dashboard from "./pages/Dashboard"
import About from './pages/About'
import NotFound from './pages/NotFound'
import SignupPage from './pages/SignupPage'
import CreateGoal from './components/CreateGoal'
import LoginPage from './pages/LoginPage'
import GoalDetail from './pages/GoalDetail'
import CreateHabit from './components/CreateHabit'
import HabitDetail from './pages/HabitDetail'
import ListHabits from './components/ListHabits'
import EditHabit from './components/EditHabit'
import EditGoal from './components/EditGoal'
import IsPrivate from './components/IsPrivate'
import { checkHabitReminderAndNotify } from './data/data'

function App() {

// Show habits
const [habits, setHabits] = useState(null);

const fetchHabits = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    setHabits(response.data);
  } catch (error) {
    console.log(error);
  }
};

// Delete habits
const deleteHabit = async (habitId) => {

  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/habits/${habitId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })

    return response

  } catch (error) {
   console.log(error) 
  }
}


//Function to Fetch Goals

const [goals, setGoals] = useState(null);
const fetchGoals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setGoals(response.data)
    } catch (error) {
      console.log(error)
    }
  }


  //Function to Delete Goals
  const deleteGoal = async (goalId) => {

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      return response

    } catch (error) {
     console.log(error) 
    }
  }


  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage goals={goals} fetchGoals={fetchGoals} habits={habits} fetchHabits={fetchHabits} />} />
        <Route path="/create-goal" element={ <IsPrivate> <CreateGoal fetchHabits={fetchHabits}/> </IsPrivate>} />
        <Route path="/goals/:goalId" element={<IsPrivate> <GoalDetail goals={goals} fetchGoals={fetchGoals} deleteGoal={deleteGoal} fetchHabits={fetchHabits} habits={habits} /> /</IsPrivate> }/>
        <Route path="/goals/edit/:goalId" element={<IsPrivate> <EditGoal /> </IsPrivate> }/>
        <Route path="/create-habit" element={<IsPrivate> <CreateHabit/> </IsPrivate> } />
        <Route path="/habits" element={<IsPrivate> <ListHabits deleteHabit={deleteHabit} fetchHabits={fetchHabits} habits={habits}/> </IsPrivate> } />
        <Route path="/habits/:habitId" element={<IsPrivate>  <HabitDetail deleteHabit = {deleteHabit} /> </IsPrivate> } />
        <Route path="/habits/edit/:habitId" element={<IsPrivate> <EditHabit/> </IsPrivate> } />
        <Route path="/dashboard" element={<IsPrivate> <Dashboard goals={goals} fetchGoals={fetchGoals} deleteGoal={deleteGoal} habits={habits} fetchHabits={fetchHabits}/> </IsPrivate>} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer/>
    </div>
  )
}

export default App
