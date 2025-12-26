import ProductCard from "./Productcard"
import { Link } from "react-router-dom"

// ProductRow component

export default function ProductRow({ category, products = [] }) {
    return (
        <div className="mb-8 md:mb-12 no-scrollbar">
            <h1 className="text-xl font-bold mb-4 capitalize">{category}</h1>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="w-60 min-w-[240px] flex-shrink-0">
                            <Link to={`/product/${product._id}`}>
                                <ProductCard
                                    img={product.images[0]}
                                    title={product.title}
                                    price={product.price}
                                    className="w-full"
                                />
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No products found in this section.</p>
                )}
            </div>
        </div>
    )
}