import React from 'react'
import { Instagram, MessageCircle } from 'lucide-react'

export const Footer = () => {
  return (
    <div className='bg-purple-500 text-white px-20 py-8 mt-10'>
        <div className="flex items-center justify-between">
            <h1>&copy;Whemsy Weavers</h1>
            <div className="links flex items-center gap-5">
                <Instagram/>
                <MessageCircle/>
            </div>
        </div>
    </div>
  )
}
