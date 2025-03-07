import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'

import './index.css'

import Navbar from './components/Navbar'
import HomePage from './pages/Homepage'
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
import { API_URL } from '../config/api'
import EditHabit from './components/EditHabit'
import EditGoal from './components/EditGoal'



function App() {

// Show habits
const [habits, setHabits] = useState(null);

const fetchHabits = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/habits`, {
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
    const response = await axios.delete(`${API_URL}/api/habits/${habitId}`, {
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
      const response = await axios.get(`${API_URL}/api/goals`, {
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
      const response = await axios.delete(`${API_URL}/api/goals/${goalId}`, {
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
        <Route path="/" element={<HomePage />} />
        <Route path="/create-goal" element={<CreateGoal fetchHabits={fetchHabits}/>} />
        <Route path="/goals/:goalId" element={<GoalDetail goals={goals} fetchGoals={fetchGoals} deleteGoal={deleteGoal}/>}/>
        <Route path="/goals/edit/:goalId" element={<EditGoal />}/>
        <Route path="/create-habit" element={<CreateHabit />} />
        <Route path="/habits" element={<ListHabits deleteHabit={deleteHabit} fetchHabits={fetchHabits} habits={habits}/>} />
        <Route path="/habits/:habitId" element={<HabitDetail deleteHabit = {deleteHabit} />} />
        <Route path="/habits/edit/:habitId" element={<EditHabit/>} />
        <Route path="/dashboard" element={<Dashboard goals={goals} fetchGoals={fetchGoals} deleteGoal={deleteGoal}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App
