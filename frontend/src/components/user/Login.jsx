import React from 'react'

export default function Login() {
  return (
    <div className='h-screen  flex items-center flex-col'>
      <div className="form-div flex flex-col items-center gap-5 m-20 w-1/2 rounded-md px-6 py-6 ">
        <h1 className='text-3xl font-semibold text-purple-800'>Login</h1>
        <p className='text-sm text-purple-400'>Welcome back </p>
        <form action="" className='flex flex-col gap-5 w-2/3' autoComplete='off' autoCorrect='off'>
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
          <div className="flex items-center justify-between w-full">
            <p className='text-sm text-blue-600 underline '>Forget password</p>
            <button type='submit' className='bg-green-600 mt-5 px-4 py-2 font-semibold text-white rounded-md'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}
