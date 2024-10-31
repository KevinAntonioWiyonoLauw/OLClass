// src/context/FoodContext.js
import React, { createContext, useState } from 'react';

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
    const [foods, setFoods] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (food) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.some(fav => fav.id === food.id)) {
                return prevFavorites.filter(fav => fav.id !== food.id);
            } else {
                return [food, ...prevFavorites];
            }
        });
    };

    return (
        <FoodContext.Provider value={{ foods, setFoods, favorites, toggleFavorite }}>
            {children}
        </FoodContext.Provider>
    );
};