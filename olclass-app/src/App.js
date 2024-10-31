import React, { useState, useEffect, useContext, useCallback } from 'react';
import HeroSection from './HeroSection';
import { FoodProvider, FoodContext } from './context/FoodContext';
import FoodList from './components/FoodList';
import DailyMealPlan from './components/DailyMealPlan';
import { fetchCulinaryData } from './api/foodApi';
import './index.css';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { ThemeProvider } from '@material-tailwind/react';
import { debounce } from 'lodash'; // Import lodash debounce
const LazyHeroSection = React.lazy(() => import('./HeroSection')); // Lazy load HeroSection
const LazyDailyMealPlan = React.lazy(() => import('./components/DailyMealPlan')); // Lazy load DailyMealPlan

const AppContent = React.memo(() => {
  const { favorites, toggleFavorite } = useContext(FoodContext);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState(null); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cuisines = ['American', 'Asian', 'European', 'Latin American'];
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const filterOptions = ['Semua', ...cuisines];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchData = useCallback(async (params) => {
    try {
      const data = await fetchCulinaryData(params);
      setAllFoods(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching culinary data:", err);
    }
  }, []);

  const debouncedFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

  useEffect(() => {
    const params = { search: searchQuery, cuisine: selectedFilter === 'Semua' ? '' : selectedFilter };
    debouncedFetchData(params);
  }, [searchQuery, selectedFilter, debouncedFetchData]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300">
        <nav className="bg-green-500 dark:bg-green-500 shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <a href="#" className="text-xl font-bold text-white dark:text-white">
                  Culinary Data
                </a>
              </div>
              <div className="hidden md:flex items-center">
                <div className="mr-4">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Search..."
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
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search..."
                />
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
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyHeroSection />
          <LazyDailyMealPlan />
        </React.Suspense>
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-center">Filter Resep</h3>
            <div>
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
        <main id="resep" className="flex-grow p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          <h2 className="text-xl font-bold mb-4 pl-6 mt-4">Favorit</h2>
          <FoodList
            foods={favorites}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            isFavorites={true}
          />
          <h2 className="text-xl font-bold mb-4 pl-6">Semua Resep</h2>
          <FoodList
            foods={allFoods}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            isFavorites={false}
          />
        </main>
        <br/><br/>
        <footer className="bg-green-500 text-white dark:bg-green-500 text-center p-4 font-bold">
          © 2024 OLClass
        </footer>
      </div>
    </ThemeProvider>
  );
});

function AppWrapper() {
  return (
    <FoodProvider>
      <AppContent />
    </FoodProvider>
  );
}

export default AppWrapper;