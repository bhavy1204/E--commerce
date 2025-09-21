export default function ProductCard({title, price, img}){
    return(
        <>
            <div className="bg-gray-600 min-w-[150px] max-w-[150px] sm:min-w-[180px] sm:max-w-[180px] md:min-w-[200px] md:max-w-[200px] lg:min-w-[240px] lg:max-w-[240px] xl:min-w-[280px] xl:max-w-[280px] mx-2 my-5 px-2 py-1 rounded-md flex flex-col">
                <img src={img} alt="" className="rounded-md" />
                <div className=" font-semibold ">
                    <h1 className="text-white mt-2">{title}</h1>
                </div>
                <div className=" flex items-center text-gray-400">
                    <h1>{'\u20B9'}{price}</h1>
                </div>
            </div>
        </>
    )
}