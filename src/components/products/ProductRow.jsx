import ProductCard from "./productcard"

// temperory products 
const items = [
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
    { img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRlURuTLlVoomnPDnI30mFTomW4m9-Yr_qcAEI_zLjLmg2O8qFA-A-1mwyLqZqtw2ATRKK7iRjBUiVSuDHIlysQxXYknxsOqpp9JGNj5gQ", title: "office chairs", price: 500 },
]

export default function ProductRow({ category}) {
    return (
        <div className="mb-20 mx-20 no-scrollbar">
            <h1 className="text-xl font-bold">{category}</h1>
            <div className="flex space-x-7 overflow-x-auto no-scrollbar">
                {items.map((item, idx) => (
                    <ProductCard
                        key={idx}
                        img={item.img}
                        title={item.title}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}