import React, { useState } from 'react'
import L0 from "../../assets/L0.jpg"
import L2 from "../../assets/L2.jpg"
import L3 from "../../assets/L3.jpg"
import L4 from "../../assets/L4.jpg"
import L5 from "../../assets/L5.jpg"
import { FaqList } from './FaqList'

export const Productpage = () => {

    const [selectedImage, setSelectedImage] = useState(L0);

    const images = [L0, L2, L3, L4, L5];

    return (
        <div className='flex flex-col items-center mx-30'>
            <div className="navigation mt-5 text-sm">
                <span>Home</span>/<span>products</span>/<span> product</span>
            </div>
            <div className="producct-desc flex h-1/2 gap-8 m-10 ">
                <div className="images flex - flex-col gap-3">
                    {images.map((img,idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt="404"
                            className='h-10 w-10 rounded-sm'
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>
                <div className="main-image">
                    <img src={selectedImage} alt="" className='h-96 ' />
                </div>
                <div className="details">
                    <h1 className='text-2xl font-semibold my-2'>Product name</h1>
                    <h3 className='my-2 text-xl'>{'\u20B9'} 600</h3>
                    <h3 className='mt-4 text-xl'>quantity * </h3>
                    <input type="number" name="" id="" max={10} min={1} className='border border-b-black py-1 px-2 w-full my-4' />
                    <button className='bg-purple-500 px-3 py-2 text-2xl w-full text-center rounded-md text-white border border-purple-600 my-2'>Add To cart</button>
                    <button className='bg-purple-700 px-3 py-2 text-2xl w-full text-center rounded-md text-white border border-purple-600 my-2'>Buy Now</button>
                </div>
            </div>
            <div className="details flex w-full">
                <div className="desc w-1/2 pl-15">
                    <h3 className='font-semibold text-xl mb-4'>Description</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, ex reprehenderit voluptatem totam ipsa dolorem quo asperiores incidunt nam itaque! Voluptatibus facere recusandae ipsa ratione nemo, harum aliquam pariatur </p>
                    <p>quidem architecto ut. Cum quae quas alias voluptatem. Voluptate voluptatem ipsum a. Unde, aut, esse aliquid natus quasi cupiditate dolor, eligendi neque debitis soluta hic! Similique facilis nisi aliquid quibusdam nostrum id suscipit ex modi, </p>
                    <p> perspiciatis dolore, ab pariatur maxime veniam, deleniti fugit quos recusandae eum illo. Dolore, cum libero. A placeat fugiat laborum earum aspernatur consequatur? Excepturi consequuntur tempore minus quas cumque rerum veniam, animi voluptatum, nostrum, natus eligendi ipsam.</p>
                </div>
                <div className="faq w-1/2 pl-20 pr-20">
                    <h3 className='font-semibold text-xl mb-4'>FAQ</h3>
                    <div className="questions flex flex-col gap-5  ">
                        <FaqList/>
                    </div>
                </div>
            </div>
        </div>
    )
}
