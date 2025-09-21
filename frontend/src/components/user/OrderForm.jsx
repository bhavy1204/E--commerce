import React from 'react'

export const OrderForm = () => {
    return (
        <div className='h-screen  flex items-center flex-col'>
            <div className="form-div flex flex-col items-center gap-5 m-20 w-1/2 rounded-md px-6 py-6 ">
                <h1 className='text-3xl font-semibold text-purple-800'>Order Details</h1>
                <form action="" className='flex flex-col gap-5 w-2/3' autoCorrect='off'>
                    <input
                        type="text"
                        name='email'
                        placeholder='address line 1'
                        className=' px-3 py-2 rounded-md border focus:outline-none '
                    />
                    <input
                        type="text"
                        name='password'
                        placeholder='address line 2'
                        className=' px-3 py-2 rounded-md border focus:outline-none'
                    />
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder='city'
                            className=' px-3 py-2 rounded-md border focus:outline-none w-1/2'
                        />
                        <input
                            type="number"
                            placeholder='pinncode'
                            className=' px-3 py-2 rounded-md border focus:outline-none w-1/2'
                            max={999999}
                            min={100000}
                        />
                    </div>

                    <button type='submit' className='bg-green-600 mt-5 px-4 py-2 font-semibold text-white rounded-md'>Proceed to payment</button>

                </form>
            </div>
        </div>
    )
}
