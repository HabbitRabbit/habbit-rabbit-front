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



function App() {

  const navigate = useNavigate()

  // const deleteGoal = (goalId) => {
  //   axios.delete(`${API_URL}/api/goals/${goalId}`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //     },
  //   })
  //   .then((res) => {
  //     console.log("Goal deleted successfully:");
  //     // navigate("/dashboard")
  //     return res.status
  //   })
  //   .catch((error) => {
  //     console.error("There was an error deleting the goal!", error);
  //   });
  // };

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
        <Route path="/create-goal" element={<CreateGoal />} />
        <Route path="/goals/:goalId" element={<GoalDetail deleteGoal={deleteGoal}/>}/>
        <Route path="/create-habit" element={<CreateHabit />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App
