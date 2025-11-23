import React, { useState, useEffect } from 'react'
import { apiClient } from '../../utils/api'

const defaultImages = [];

export const Carousal = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState(defaultImages);

    useEffect(() => {
        const fetchSlider = async () => {
            try {
                const response = await apiClient.getSiteContent();
                if (response.success && response.data.sliderImages?.length) {
                    setImages(response.data.sliderImages);
                }
            } catch (error) {
                console.error('Failed to load slider images', error);
            }
        };
        fetchSlider();
    }, []);

    useEffect(() => {
        if (!images.length) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="head text-center md:text-left px-4 md:px-20 my-16 flex flex-col md:flex-row items-center justify-between gap-12">

            <div className="w-full md:w-1/2">
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                    Discover our <br />
                    <span className="text-purple-700">new Collection</span> <br />
                    <span className="text-base md:text-lg">
                        Curated with care, crafted for you.  
                        Don't miss out on what's new.
                    </span>
                </h1>
            </div>

            <div className="relative w-full md:w-1/2 h-60 md:h-[400px] overflow-hidden rounded-xl shadow-lg">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={image.alt || `Slide ${index + 1}`}
                            className="w-full h-60 md:h-[400px] object-cover flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}
