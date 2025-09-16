import React from 'react'
import { Link } from 'react-router-dom'


export default function Nav(){
return (
<nav className="bg-white shadow">
<div className="container flex items-center justify-between py-4">
<Link to="/" className="font-bold text-xl">3-Tier App</Link>
<div className="space-x-4">
<Link to="/register" className="px-3 py-1 rounded hover:bg-gray-100">Sign up</Link>
<Link to="/login" className="px-3 py-1 rounded bg-blue-600 text-white">Log in</Link>
</div>
</div>
</nav>
)
}