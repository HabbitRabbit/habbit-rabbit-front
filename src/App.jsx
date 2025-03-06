import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

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



function App() {

  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-goal" element={<CreateGoal />} />
        <Route path="/goals/:goalId" element={<GoalDetail/>}/>
        <Route path="/create-habit" element={<CreateHabit />} />
        <Route path="/habits/:habitId" element={<HabitDetail />} />
        <Route path="/habits" element={<ListHabits />} />
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
