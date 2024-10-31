// src/components/DailyMealPlan.js
import React, { useEffect, useState } from 'react';
import { fetchDailyMealPlan } from '../api/foodApi';

const DailyMealPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMealPlan = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDailyMealPlan();
        console.log(data); // Debugging: Periksa data yang diterima
        setMealPlan(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching daily meal plan:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getMealPlan();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading Daily Meal Plan...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!mealPlan) {
    return null;
  }

  // Helper function to construct the correct image URL
  const getImageUrl = (id, imageType) => {
    return `https://spoonacular.com/recipeImages/${id}-556x370.${imageType}`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Daily Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealPlan.meals.map((meal) => (
          <div key={meal.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
            <img
              src={getImageUrl(meal.id, meal.imageType)}
              alt={meal.title}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <h3 className="text-xl font-semibold mt-2">{meal.title}</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Ready in {meal.readyInMinutes} minutes
            </p>
            <a
              href={meal.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors duration-300"
            >
              View Recipe
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <h4 className="text-lg font-semibold">Nutritional Information</h4>
        <ul className="list-disc list-inside mt-2">
          <li>Calories: {mealPlan.nutrients.calories}</li>
          <li>Protein: {mealPlan.nutrients.protein}g</li>
          <li>Carbohydrates: {mealPlan.nutrients.carbohydrates}g</li>
          <li>Fat: {mealPlan.nutrients.fat}g</li>
        </ul>
      </div>
    </div>
  );
};

export default DailyMealPlan;