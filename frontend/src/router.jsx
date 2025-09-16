import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'


export default function RouterComp(){
return (
<Routes>
<Route path="/" element={<Landing/>} />
<Route path="/register" element={<Register/>} />
<Route path="/login" element={<Login/>} />
<Route path="/dashboard" element={<Dashboard/>} />
</Routes>
)
}