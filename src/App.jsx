import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import './index.css'

import Navbar from './components/Navbar'
import Goal from './components/Goal'

import HomePage from './pages/Homepage'
import Dashboard from "./pages/Dashboard"
import About from './pages/About'
import NotFound from './pages/NotFound'



function App() {

  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goals" element={<Goal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App
