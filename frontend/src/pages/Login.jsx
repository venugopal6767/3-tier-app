import React, {useState} from 'react'
import api from '../services/api'
import { saveToken } from '../services/auth'
import { useNavigate } from 'react-router-dom'


export default function Login(){
const [form, setForm] = useState({email:'', password:''})
const [err, setErr] = useState(null)
const navigate = useNavigate()


function handleChange(e){ setForm({...form, [e.target.name]: e.target.value}) }


async function submit(e){
e.preventDefault(); setErr(null)
try{
const res = await api.post('/api/login', form)
saveToken(res.data.access_token)
navigate('/dashboard')
}catch(e){
setErr(e?.response?.data?.detail || 'Login failed')
}
}


return (
<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
<h2 className="text-2xl font-semibold mb-4">Login</h2>
{err && <div className="mb-3 p-2 bg-red-50 text-red-800 rounded">{err}</div>}
<form onSubmit={submit} className="space-y-3">
<input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded" />
<input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" />
<button className="w-full py-2 bg-blue-600 text-white rounded">Log in</button>
</form>
</div>
)
}