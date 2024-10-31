// src/api/foodApi.js
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

// Existing fetchCulinaryData function
export const fetchCulinaryData = async (params) => {
  const { search, cuisine } = params;
  const query = new URLSearchParams({
    query: search,
    cuisine: cuisine,
    number: 20,
    apiKey: API_KEY,
  }).toString();

  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch culinary data');
  }

  const data = await response.json();
  return data.results;
};

// New fetchDailyMealPlan function
export const fetchDailyMealPlan = async () => {
  const query = new URLSearchParams({
    timeFrame: 'day',
    apiKey: API_KEY,
  }).toString();

  const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch daily meal plan');
  }

  const data = await response.json();
  return data;
};