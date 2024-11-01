import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import { FoodContext } from '../context/FoodContext';
import { fetchCulinaryData } from '../api/foodApi';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const FoodList = memo(({ searchQuery = '', foods = [], toggleFavorite, favorites = [], isFavorites = false }) => {
    const { setFoods } = useContext(FoodContext);
    const [selectedFood, setSelectedFood] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isFavorites) {
            const getFoods = async () => {
                try {
                    const data = await fetchCulinaryData(searchQuery);
                    setFoods(data);
                } catch (err) {
                    console.error("Error fetching culinary data:", err);
                }
            };
            getFoods();
        }
    }, [setFoods, searchQuery, isFavorites]);

    const openModal = useCallback(async (food) => {
        setSelectedFood(food);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/${food.id}/information`, {
                params: {
                    apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
                },
            });

            setRecipeDetails(response.data);
        } catch (err) {
            console.error("Error fetching recipe details:", err.response ? err.response.data : err.message);
            setError("Failed to load recipe details.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const closeModal = useCallback(() => {
        setSelectedFood(null);
        setRecipeDetails(null);
        setError(null);
    }, []);

    const settings = isFavorites ? {
        dots: true,
        infinite: favorites.length > 3,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    arrows: true,
                }
            }
        ],
        appendDots: dots => (
            <div className="mt-6 mb-6 pb-4">
                <ul className="slick-dots">{dots}</ul>
            </div>
        ),
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        lazyLoad: 'ondemand', 
    } : {
        dots: true,
        infinite: foods.length > 3,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '30px',
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    arrows: true,
                }
            }
        ],
        appendDots: dots => (
            <div className="mt-6 mb-6 pb-4">
                <ul className="slick-dots">{dots}</ul>
            </div>
        ),
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        lazyLoad: 'ondemand', 
    };

    return (
        <div className="p-6 relative">
            {!isFavorites && (
                <>
                    {/* Gradasi Transparan */}
                    <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-gray-100 dark:from-gray-800 pointer-events-none"></div>
                    {/* Gradasi Transparan */}
                    <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-gray-100 dark:from-gray-800 pointer-events-none"></div>
                </>
            )}
            
            <Slider {...settings}>
                {foods.length > 0 ? (
                    foods.map(food => (
                        <div key={food.id} className="px-4">
    <div
        className="relative bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden flex flex-col justify-between h-[400px] w-full"
    >
        <button
            onClick={() => toggleFavorite(food)}
            className={`absolute top-2 right-2 text-4xl ${favorites.some(fav => fav.id === food.id) ? 'text-yellow-500' : 'text-white'} transition-transform duration-300 transform hover:scale-110 z-10`}
        >
            ★
        </button>
        <a href="#">
            <div className="relative">
                <img loading="lazy" className="w-full h-48 object-cover rounded-t-lg" src={food.image} alt={food.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-green-900"></div>
            </div>
        </a>
        <div className="p-5 flex-grow flex flex-col justify-between">
            <div>
                <a href="#">
                    <h5 className="mb-2 text-lg font-bold text-gray-900 dark:text-white text-left">
                        {food.title}
                    </h5>
                </a>
            </div>
            <div className="mt-auto">
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
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
                    ))
                ) : (
                    <div className="w-full">
                        <p className="text-center text-gray-700 dark:text-gray-300">No recipes found.</p>
                    </div>
                )}

            </Slider>
            {/* Modal */}
            {selectedFood && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative overflow-y-auto max-h-[80vh] transform transition-transform duration-300 scale-100">
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
                                <h2
                                    className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 break-words truncate"
                                    title={recipeDetails.title}
                                >
                                    {recipeDetails.title}
                                </h2>
                                {recipeDetails.images && recipeDetails.images.length > 0 ? (
                                    <Slider {...{
                                        dots: true,
                                        infinite: recipeDetails.images.length > 1,
                                        speed: 500,
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        arrows: true,
                                        autoplay: true,
                                        autoplaySpeed: 3000
                                    }}>
                                        {recipeDetails.images.map((image, index) => (
                                            <div key={index}>
                                                <img
                                                    className="w-full h-48 object-cover rounded mb-4"
                                                    src={image}
                                                    alt={`${recipeDetails.title} image ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                ) : (
                                    <img
                                        className="w-full h-48 object-cover rounded mb-4"
                                        src={recipeDetails.image}
                                        alt={recipeDetails.title}
                                    />
                                )}
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
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    View Full Recipe
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
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
});

export default FoodList;