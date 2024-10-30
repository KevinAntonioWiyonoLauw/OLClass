// src/api/foodApi.js
import axios from 'axios';

export const fetchCulinaryData = async (query) => {
    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
                number: 10,
                addRecipeInformation: true,
                query: query,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching culinary data:", error);
        throw error;
    }
};