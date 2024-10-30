// src/App.js
import React, { useState, useEffect } from 'react';
import { FoodProvider } from './context/FoodContext';
import FoodList from './components/FoodList';
import './index.css'; // Pastikan ini mengimpor Tailwind CSS

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if(darkMode){
      document.documentElement.classList.add('dark');
    } else{
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <FoodProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 font-montserrat">
        <header className="bg-green-300 dark:bg-green-700 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Culinary Data</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>
        <main className="flex-grow p-4">
          <FoodList />
        </main>
        <footer className="bg-green-300 dark:bg-green-700 text-center p-4">
          © 2024 OLClass
        </footer>
      </div>
    </FoodProvider>
  );
}

export default App;