// src/App.js
import React, { useState, useEffect, useContext } from 'react';
import HeroSection from './HeroSection';
import { FoodProvider, FoodContext } from './context/FoodContext';
import FoodList from './components/FoodList';
import DailyMealPlan from './components/DailyMealPlan'; // Import DailyMealPlan component
import { fetchCulinaryData } from './api/foodApi'; // Ensure this import is present
import './index.css';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { ThemeProvider } from '@material-tailwind/react';

function AppContent() {
  const { favorites, toggleFavorite } = useContext(FoodContext);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState(null); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Daftar cuisines yang diinginkan
  const cuisines = [
    'American',
    'Asian',
    'European',
    'Latin American'
  ];

  // State untuk filter kategori makanan
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  
  // State untuk opsi filter
  const filterOptions = ['Semua', ...cuisines];

  // Mengatur kelas 'dark' pada elemen root berdasarkan state darkMode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Mengambil data culinary berdasarkan search query dan selectedFilter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { search: searchQuery, cuisine: selectedFilter === 'Semua' ? '' : selectedFilter };
        const data = await fetchCulinaryData(params);
        setAllFoods(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching culinary data:", err);
      }
    };
    fetchData();
  }, [searchQuery, selectedFilter]);

  // Fungsi untuk menangani toggle menu mobile
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300">
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-900 shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="#" className="text-xl font-bold text-gray-800 dark:text-white">
                  Culinary Data
                </a>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center">
                {/* Search Input */}
                <div className="mr-4">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Search..."
                  />
                </div>
                
                {/* Dark Mode Toggle */}
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

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={handleMobileMenuToggle}
                  className="p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {/* Search Input */}
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search..."
                />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 flex items-center justify-center mt-2"
                >
                  {darkMode ? (
                    <>
                      <SunIcon className="h-6 w-6 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-6 w-6 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <HeroSection />

        {/* Daily Meal Plan */}
        <DailyMealPlan />

        {/* Filter Container */}
        <div className="flex flex-col items-center mt-8">
          {/* Container for Filter Resep */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md w-full max-w-2xl">
            {/* Judul Filter Resep */}
            <h3 className="text-xl font-semibold mb-4 text-center">Filter Resep</h3>

            {/* Tombol Filter */}
            {/* Responsive Layout: Horizontal on md and above, Dropdown on small screens */}
            <div>
              {/* Desktop Filter Buttons */}
              <div className="hidden sm:flex justify-center space-x-2">
                {filterOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedFilter(option)}
                    className={`px-4 py-2 m-1 rounded focus:outline-none transition-colors duration-300 ${
                      selectedFilter === option
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-green-400 hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Mobile Dropdown Filter */}
              <div className="sm:hidden">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {filterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main id="resep" className="flex-grow p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          <h2 className="text-xl font-bold mb-4">Favorit</h2>
          <FoodList
            foods={favorites}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            isFavorites={true}
          />
          <h2 className="text-xl font-bold mb-4 mt-8">Semua Resep</h2>
          <FoodList
            foods={allFoods}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            isFavorites={false}
          />
        </main>
        
        <br/><br/>

        {/* Footer */}
        <footer className="bg-green-700 dark:bg-green-800 text-center p-4 font-bold">
          © 2024 OLClass
        </footer>
      </div>
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <FoodProvider>
      <AppContent />
    </FoodProvider>
  );
}

export default AppWrapper;