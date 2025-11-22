export default function ProductCard({ title, price, img }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col w-60 min-w-[240px]">
            <div className="h-52 w-full overflow-hidden">
                <img 
                    src={img} 
                    alt={title} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h2>
                <div className="mt-auto">
                    <p className="text-lg font-bold text-purple-600">
                        ₹{price}
                    </p>
                </div>
            </div>
        </div>
    );
}