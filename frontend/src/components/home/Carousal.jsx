import React, { useState, useEffect } from 'react'
import { apiClient } from '../../utils/api'

const defaultImages = [
    // { url: main1, alt: 'Default 1' },
    // { url: main2, alt: 'Default 2' },
    // { url: main3, alt: 'Default 3' },
    // { url: main4, alt: 'Default 4' },
];

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
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="head text-6xl mx-30 my-30 font-semibold flex justify-between">
            <div className="flex items-center w-1/2 pr-10">
                <h1>Discover our <br /> <span className="text-purple-700">new Collection</span> <br /> <span className='text-sm '>Curated with care, crafted for you. Don't miss out on what's new.</span></h1>
            </div>

            <div className="relative w-1/2 h-[400px] overflow-hidden rounded-xl shadow-lg">
                <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }} >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={image.alt || `Slide ${index + 1}`}
                            className="w-full h-[400px] object-cover flex-shrink-0"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
