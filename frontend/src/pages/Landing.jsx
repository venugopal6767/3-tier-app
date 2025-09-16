import React from 'react'
import { Link } from 'react-router-dom'


export default function Landing(){
return (
<div className="text-center py-12">
<h1 className="text-4xl font-bold mb-4">Welcome to the 3-Tier App</h1>
<p className="mb-6 text-lg">An example app demonstrating frontend, backend, and database with monitoring.</p>
<div className="flex items-center justify-center gap-4">
<Link to="/register" className="px-5 py-2 bg-green-600 text-white rounded">Get Started</Link>
<Link to="/login" className="px-5 py-2 border rounded">Login</Link>
</div>
</div>
)
}