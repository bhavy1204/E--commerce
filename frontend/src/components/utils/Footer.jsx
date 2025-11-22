import React from 'react'
import { InstagramLogo, WhatsappLogo, EnvelopeSimple } from "phosphor-react";

export const Footer = () => {
  return (
    <div className='bg-purple-500 text-white px-4 md:px-20 py-8 mt-10'>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1>&copy; Whimsy Weavers</h1>

        <div className="links flex items-center gap-5">

          {/* Instagram */}
          <InstagramLogo
            size={32}
            className="cursor-pointer hover:text-purple-600"
            onClick={() => window.open("https://instagram.com/YOUR_USERNAME_HERE", "_blank")}
          />

          {/* WhatsApp */}
          <WhatsappLogo
            size={32}
            className="cursor-pointer hover:text-purple-600"
            onClick={() => window.open("https://wa.me/YOUR_WHATSAPP_NUMBER_HERE", "_blank")}
          />

          {/* Email */}
          <EnvelopeSimple
            size={32}
            className="cursor-pointer hover:text-purple-600"
            onClick={() => window.open("mailto:YOUR_EMAIL_HERE")}
          />

        </div>
      </div>
    </div>
  )
}
