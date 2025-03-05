import { useState } from 'react'
import './index.css'
import Goal from './components/Goal'
import HomePage from './pages/Homepage'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<HomePage/>} />
    <Route path="/goals" element={<Goal/>} />
    </Routes>
   
    </>
  )
}

export default App
