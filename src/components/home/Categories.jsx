import React from 'react'
import ProductCard from '../products/productcard'
import ProductRow from '../products/ProductRow'

export const Categories = () => {
  return (
    <div>
        <h1 className='text-3xl mx-20 font-semibold mb-10'>Shop By <span className='text-purple-700'>Categories</span></h1>
        <ProductRow category={"Clothing"}/>
        <ProductRow category={"jewellry"}/>
        <ProductRow category={"other"}/>
    </div>
  )
}
