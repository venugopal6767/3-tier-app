import React, {useState} from 'react'
import api from '../services/api'


export default function Register(){
const [form, setForm] = useState({username:'', email:'', password:''})
const [msg, setMsg] = useState(null)
const [err, setErr] = useState(null)


function handleChange(e){
setForm({...form, [e.target.name]: e.target.value})
}


async function submit(e){
e.preventDefault(); setErr(null); setMsg(null)
// basic validation
if(!form.username || !form.email || form.password.length < 6){
setErr('Please provide username, email, and password (min 6 chars).')
return
}
try{
const res = await api.post('/api/register', form)
setMsg('Registration successful! You can now log in.')
setForm({username:'', email:'', password:''})
}catch(err){
setErr(err?.response?.data?.detail || 'Registration failed')
}
}


return (
<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
<h2 className="text-2xl font-semibold mb-4">Create account</h2>
{msg && <div className="mb-3 p-2 bg-green-50 text-green-800 rounded">{msg}</div>}
{err && <div className="mb-3 p-2 bg-red-50 text-red-800 rounded">{err}</div>}
<form onSubmit={submit} className="space-y-3">
<input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full p-2 border rounded" />
<input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded" />
<input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" />
<button className="w-full py-2 bg-blue-600 text-white rounded">Sign up</button>
</form>
</div>
)
}