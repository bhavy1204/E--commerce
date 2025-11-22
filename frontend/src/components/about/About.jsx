import React, { useEffect, useState } from 'react'
import L0 from "../../assets/L0.jpg"
import { apiClient } from '../../utils/api'

export default function About() {
    const [aboutText, setAboutText] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await apiClient.getSiteContent()
                if (response.success) {
                    setAboutText(response.data.aboutText || '')
                }
            } catch (error) {
                console.error('Failed to load about content', error)
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [])

    return (
        <div className='px-4 md:px-10 py-10'>
            <div className='max-w-3xl mx-auto flex items-center justify-center flex-col text-center'>
                <h1 className='text-3xl font-bold text-purple-600 my-5'>About Us</h1>
                <img src={L0} alt="" className='h-40 w-40 rounded-full object-cover shadow-md mb-6' />
                {loading ? (
                    <p className='text-gray-500'>Loading...</p>
                ) : (
                    <p className='text-base leading-7 text-gray-700 whitespace-pre-line'>
                        {aboutText || 'We are busy crafting our story. Please check back soon!'}
                    </p>
                )}
            </div>
        </div>
    )
}
