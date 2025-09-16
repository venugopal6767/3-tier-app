import React, {useEffect, useState} from 'react'
import api from '../services/api'
import { getToken, logout } from '../services/auth'
import { useNavigate } from 'react-router-dom'


export default function Dashboard(){
const [status, setStatus] = useState(null)
const navigate = useNavigate()


useEffect(()=>{
async function load(){
try{
const token = getToken()
if(!token) return navigate('/login')
const res = await api.get('/api/me', { headers: { Authorization: `Bearer ${token}` } })
setStatus(res.data)
}catch(e){
console.error(e)
navigate('/login')
}
}
load()
},[])


function doLogout(){ logout(); navigate('/login') }


return (
<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold">Dashboard</h2>
<button onClick={doLogout} className="px-3 py-1 border rounded">Logout</button>
</div>
<div>
<pre className="bg-gray-50 p-4 rounded">{JSON.stringify(status, null, 2)}</pre>
</div>
</div>
)
}