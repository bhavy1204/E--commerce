import React from 'react'

export const Signup = () => {
    return (
        <div className='h-screen  flex items-center flex-col'>
            <div className="form-div flex flex-col items-center gap-5 m-20 w-1/2 rounded-md px-6 py-6 ">
                <h1 className='text-3xl font-semibold text-purple-800'>Signup</h1>
                <form action="" className='flex flex-col gap-5' autoComplete='off' autoCorrect='off'>
                    <div className='flex gap-4 mb-3'>
                        <input
                            type="text"
                            name='fname'
                            placeholder='First Name'
                            className='w-1/2 px-3 py-2 rounded-md border focus:outline-none'
                        />
                        <input
                            type="text"
                            name='last Name'
                            placeholder='state'
                            className='w-1/2 px-3 py-2 rounded-md border focus:outline-none'
                        />
                    </div>
                    <input
                        type="email"
                        name='email'
                        placeholder='email'
                        className=' px-3 py-2 rounded-md border focus:outline-none '
                    />
                    <input
                        type="password"
                        name='password'
                        controls
                        placeholder='password'
                        className=' px-3 py-2 rounded-md border focus:outline-none'
                    /> 
                    <button type='submit' className='bg-green-600 mt-5 px-4 py-2 font-semibold text-white rounded-md'>Submit</button>
                </form>
            </div>
        </div>
    )
}
