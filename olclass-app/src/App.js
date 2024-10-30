// src/App.js
import React, { useState, useEffect } from 'react';
import { FoodProvider } from './context/FoodContext';
import FoodList from './components/FoodList';
import { fetchCulinaryData } from './api/foodApi';
import './index.css';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState(null); // State untuk error

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCulinaryData(searchQuery);
        setAllFoods(data);
        setError(null); // Reset error jika berhasil
      } catch (err) {
        setError(err.message);
        console.error("Error fetching culinary data:", err);
      }
    };
    fetchData();
  }, [searchQuery]);

  const toggleFavorite = (food) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(fav => fav.id === food.id)) {
        return prevFavorites.filter(fav => fav.id !== food.id);
      } else {
        return [food, ...prevFavorites]; // Menambahkan baru di awal
      }
    });
  };

  return (
    <FoodProvider>
      <div
        className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300 relative overflow-hidden"
        style={{ fontFamily: 'Arial' }}
      >

        {/* Header */}
        <header className="bg-white dark:bg-gray-700 p-4 flex justify-between items-center z-10 relative">
          <h1 className="text-2xl font-bold text-center flex-grow">Culinary Data</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                required
              />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 z-10">
          {error && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          <h2 className="text-xl font-bold mb-4 ml-5">Favorites</h2>
          <FoodList 
            foods={favorites} 
            toggleFavorite={toggleFavorite} 
            favorites={favorites} 
            isFavorites={true} 
          />
          <h2 className="text-xl font-bold mb-4 ml-5 pt-4 mt-8">All Recipes</h2> {/* Tambahkan mt-8 untuk jarak */}
          <FoodList 
            foods={allFoods} 
            toggleFavorite={toggleFavorite} 
            favorites={favorites} 
            isFavorites={false} 
          />
        </main>
        <br/><br/>
        {/* Footer */}
        <footer className="bg-green-500 dark:bg-green-600 text-center p-4 z-10 relative">
          © 2024 OLClass
        </footer>
      </div>
    </FoodProvider>
  );
}

export default App;