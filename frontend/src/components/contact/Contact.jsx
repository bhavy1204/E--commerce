import React from "react";

export default function Contact() {
    return (
        <>
            <div className='flex items-center justify-center py-10 w-1/2 flex-col m-auto'>
                <h1 className='text-2xl font-bold text-purple-600 my-5'>Contact us</h1>

                <form action="" className="flex flex-col w-2/3 px-10 py-10 gap-5 items-center">
                    <input type="text" name="name" placeholder="Name" className="px-2 py-1 w-full border rounded-sm" />
                    <input type="email" name="email" placeholder="Email" className="px-2 py-1 w-full border rounded-sm" />
                    <input type="text" name="message" placeholder="Message" className="px-2 py-1 w-full border rounded-sm" />
                    <button className="bg-green-600 font-semibold py-2 rounded-md text-white w-1/3">Send</button>
                </form>
            </div>
        </>
    )
}