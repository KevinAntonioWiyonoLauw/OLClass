// src/context/FoodContext.js
import React, { createContext, useState } from 'react';

// Membuat Context baru untuk makanan
export const FoodContext = createContext();

// Komponen penyedia context untuk makanan
export const FoodProvider = ({ children }) => {
    // State untuk menyimpan daftar makanan
    const [foods, setFoods] = useState([]);
    // State untuk menyimpan daftar favorit
    const [favorites, setFavorites] = useState([]);

    // Fungsi untuk menambah atau menghapus makanan dari favorit
    const toggleFavorite = (food) => {
        setFavorites((prevFavorites) => {
            // Cek apakah makanan sudah ada di favorit
            if (prevFavorites.some(fav => fav.id === food.id)) {
                // Jika sudah, hapus dari favorit
                return prevFavorites.filter(fav => fav.id !== food.id);
            } else {
                // Jika belum, tambahkan ke favorit
                return [food, ...prevFavorites];
            }
        });
    };

    // Menyediakan state dan fungsi kepada komponen anak melalui Context
    return (
        <FoodContext.Provider value={{ foods, setFoods, favorites, toggleFavorite }}>
            {children}
        </FoodContext.Provider>
    );
};