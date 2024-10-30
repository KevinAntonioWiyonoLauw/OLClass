// src/api/foodApi.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const fetchCulinaryData = async (query = '') => {
    try {
        const response = await axios.get(`${BASE_URL}/complexSearch`, {
            params: {
                number: 10, // Jumlah data yang diambil
                apiKey: API_KEY,
                addRecipeInformation: true, // Menambahkan informasi resep
                query, // Menambahkan query pencarian
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching culinary data:', error);
        return [];
    }
};