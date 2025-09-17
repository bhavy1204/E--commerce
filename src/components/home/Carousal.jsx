import React from 'react'
import { useState, useEffect } from 'react'
import L0 from "../../assets/L0.jpg"
import L2 from "../../assets/L2.jpg"
import L3 from "../../assets/L3.jpg"

export const Carousal = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        { src: L0, alt: 'Description 1' },
        { src: L2, alt: 'Description 2' },
        { src: L3, alt: 'Description 2' },
    ];

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
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-[400px] object-cover flex-shrink-0"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
