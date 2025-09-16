import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listTodos, createTodo, updateTodo, deleteTodo } from '../api';

export default function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await listTodos(userId);
    setTodos(res.todos || []);
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [userId]);

  async function add() {
    if (!title) return;
    await createTodo(userId, title);
    setTitle('');
    load();
  }

  async function toggle(todo) {
    await updateTodo(todo.id, todo.title, !todo.completed);
    load();
  }

  async function remove(id) {
    await deleteTodo(id);
    load();
  }

  return (
    <div className="card">
      <h2>Your Todos</h2>
      <div className="form-row">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="new todo" />
        <button onClick={add}>Add</button>
      </div>
      {loading ? <div>Loading...</div> : todos.map(t => (
        <div key={t.id} className="todo-item">
          <div>
            <input type="checkbox" checked={t.completed} onChange={()=>toggle(t)} /> <strong>{t.title}</strong>
            <div className="small">Created: {new Date(t.created_at).toLocaleString()}</div>
          </div>
          <div>
            <button onClick={()=>remove(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
