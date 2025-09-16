import React from 'react'
import Router from './router'
import Nav from './components/Nav'


export default function App(){
return (
<div className="min-h-screen bg-gray-50 text-gray-900">
<Nav />
<main className="container py-8">
<Router />
</main>
</div>
)
}