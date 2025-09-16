import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-6 max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Todo App</h1>
        <p className="mb-6 text-gray-600">Manage your tasks efficiently with our simple and intuitive todo application.</p>
        <div className="space-x-4">
          <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</Link>
          <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Login</Link>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-600">
            This todo app allows you to:
            <ul className="list-disc list-inside text-left">
              <li>Create, update, and delete tasks with titles, descriptions, and scheduled times.</li>
              <li>Schedule tasks to be reminded at specific times.</li>
              <li>Track your activities with event logging.</li>
              <li>Monitor app performance with metrics like registrations, logins, and task actions.</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;