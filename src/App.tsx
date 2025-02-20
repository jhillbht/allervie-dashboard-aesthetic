import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Allervie Dashboard
        </h1>
        
        <nav className="space-y-2">
          <Link 
            to="/test" 
            className="block p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            Go to Test Page
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default App;