// src/components/FoodList.js
import React, { useContext, useEffect, useState } from 'react';
import { FoodContext } from '../context/FoodContext';
import { fetchCulinaryData } from '../api/foodApi';
import axios from 'axios';

const FoodList = () => {
    const { foods, setFoods } = useContext(FoodContext);
    const [selectedFood, setSelectedFood] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFoods = async () => {
            try {
                const data = await fetchCulinaryData();
                setFoods(data);
            } catch (err) {
                console.error("Error fetching culinary data:", err);
            }
        };
        getFoods();
    }, [setFoods]);

    const openModal = async (food) => {
        console.log("Fetching details for food ID:", food.id); // Debugging
        setSelectedFood(food);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/${food.id}/information`, {
                params: {
                    apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
                },
            });

            console.log("Recipe Details:", response.data); // Debugging
            setRecipeDetails(response.data);
        } catch (err) {
            console.error("Error fetching recipe details:", err.response ? err.response.data : err.message);
            setError("Failed to load recipe details.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedFood(null);
        setRecipeDetails(null);
        setError(null);
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {foods.length > 0 ? (
                    foods.map(food => (
                        <div
                            key={food.id}
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
                        >
                            <a href="#">
                                <img className="rounded-t-lg" src={food.image} alt={food.title} />
                            </a>
                            <div className="p-5">
                                <a href="#">
                                    <h5 className="mb-2 text-lg tracking-tight text-gray-900 dark:text-white text-center">
                                        {food.title}
                                    </h5>
                                </a>
                                {/* Deskripsi telah dihapus */}
                                <button
                                    onClick={() => openModal(food)}
                                    disabled={isLoading}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Loading...' : 'Read more'}
                                    <svg
                                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
                )}
            </div>

            {/* Modal */}
            {selectedFood && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-full transform transition-transform duration-300 scale-100">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <svg className="animate-spin h-8 w-8 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                            </div>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : recipeDetails ? (
                            <>
                                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                                    {recipeDetails.title}
                                </h2>
                                <img
                                    className="w-full h-64 object-cover rounded mb-4"
                                    src={recipeDetails.image}
                                    alt={recipeDetails.title}
                                />
                                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {recipeDetails.summary.replace(/<[^>]+>/g, '')}
                                </p>
                                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Ingredients</h3>
                                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                                    {recipeDetails.extendedIngredients.map(ingredient => (
                                        <li key={ingredient.id}>{ingredient.original}</li>
                                    ))}
                                </ul>
                                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Instructions</h3>
                                <div className="text-gray-700 dark:text-gray-300">
                                    {recipeDetails.instructions ? (
                                        <div dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }} />
                                    ) : (
                                        <p>No instructions available.</p>
                                    )}
                                </div>
                                {/* Link to Full Recipe */}
                                <a
                                    href={recipeDetails.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    View Full Recipe
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </>
                        ) : (
                            <p className="text-center text-gray-700 dark:text-gray-300">No details available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodList;