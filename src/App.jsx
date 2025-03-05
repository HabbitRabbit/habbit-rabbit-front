import { useState } from 'react'
import './index.css'
import Goal from './components/Goal'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<HomePage/>} />
    <Route path="/goals" element={<Goal/>} />
    <h1>Hello</h1>
    </Routes>
   
    </>
  )
}

export default App
