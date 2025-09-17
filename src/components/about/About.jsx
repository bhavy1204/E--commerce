import React from 'react'
import Navbar from '../utils/Navbar'
import L0 from "../../assets/L0.jpg"

export default function About() {
    return (
        <div className=''>
            <div className='flex items-center justify-center py-10 w-1/2 flex-col m-auto'>
                <h1 className='text-2xl font-bold text-purple-600 my-5'>About this page</h1>
                <img src={L0} alt="" className='h-48 rounded-full ' />
                <p className='mt-5 text-sm leading-[1.8] text-justify'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus maxime quasi, pariatur ea totam neque eius dolor repudiandae maiores facere laboriosam ad alias voluptate iste temporibus expedita, ex sequi minima officiis asperiores aperiam odit veniam. Minima atque fugiat rem qui impedit ad deleniti ipsam, ipsum consectetur ab unde ut necessitatibus blanditiis quod pariatur, in voluptate asperiores inventore cum explicabo. Neque excepturi ex perspiciatis blanditiis atque, dolorum dolore cupiditate maxime omnis maiores incidunt, voluptatem debitis, accusantium eum et non corrupti dignissimos aliquid consequatur! </p>

                <p className='mt-4 text-sm leading-[1.8] text-justify'>Necessitatibus dolorem sequi excepturi nisi omnis dolor soluta error ab dolores, odio non rerum maiores veritatis mollitia magnam aliquam recusandae numquam. Numquam vitae quidem voluptas voluptatum suscipit doloremque corporis itaque, perspiciatis illo ratione. Rem, fugiat. Enim sequi tempore eius eos minus inventore accusantium ipsa perferendis? Reiciendis, quod cumque enim fugit, at dolorem sint illo doloribus nihil quas ullam maiores. Dolor sapiente assumenda doloremque ab perferendis reprehenderit? Quam quaerat quod delectus vero, voluptate autem odio maxime accusamus ut repudiandae quidem dignissimos tempore recusandae deleniti, neque expedita deserunt perferendis odit provident veritatis suscipit ducimus necessitatibus aliquam doloribus. At, tenetur deleniti animi, sequi temporibus repellendus vitae soluta dolorum maiores ad, sapiente tempore eos? Natus nesciunt quas, aspernatur delectus voluptates incidunt voluptatibus.</p>
            </div>
        </div>
    )
}
