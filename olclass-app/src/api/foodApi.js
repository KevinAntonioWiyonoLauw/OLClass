// Mendefinisikan API_KEY dari environment variable
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

// Membuat cache untuk menyimpan hasil yang sudah diambil
const cache = {};

// Fungsi untuk mengambil data kuliner berdasarkan parameter yang diberikan
export const fetchCulinaryData = async (params) => {
  const { search, cuisine } = params;
  // Membuat query string dengan parameter pencarian
  const query = new URLSearchParams({
    query: search,
    cuisine: cuisine,
    number: 20,
    apiKey: API_KEY,
  }).toString();

  const cacheKey = `culinaryData-${query}`;
  // Memeriksa apakah data sudah ada di cache
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Mengambil data dari API Spoonacular
  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch culinary data');
  }

  const data = await response.json();
  // Menyimpan hasil ke cache
  cache[cacheKey] = data.results;
  return data.results;
};

// Fungsi untuk mengambil rencana makan harian
export const fetchDailyMealPlan = async () => {
  const query = new URLSearchParams({
    timeFrame: 'day',
    apiKey: API_KEY,
  }).toString();

  const cacheKey = `dailyMealPlan-${query}`;
  // Memeriksa apakah data sudah ada di cache
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Mengambil data rencana makan harian dari API
  const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch daily meal plan');
  }

  const data = await response.json();
  // Menyimpan hasil ke cache
  cache[cacheKey] = data;
  return data;
};