import React from 'react'
import { InstagramLogo, WhatsappLogo, EnvelopeSimple } from "phosphor-react";

export const Footer = () => {
  return (
    <div className='bg-purple-500 text-white px-4 md:px-20 py-8 mt-10'>
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between text-center md:text-left gap-6 md:gap-4">

        <div className="flex flex-col gap-2">
          <h1 className="text-lg md:text-base">&copy; Whimsy Weavers</h1>
          <div className="flex gap-4 text-sm text-purple-200">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</a>
            <a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>

        <div className="links flex items-center justify-center md:justify-end gap-6">

          {/* Instagram */}
          <InstagramLogo
            size={32}
            className="cursor-pointer hover:text-purple-600"
            onClick={() => window.open("https://instagram.com/whimsy_weavers", "_blank")}
          />

          {/* WhatsApp */}
          <WhatsappLogo
            size={32}
            className="cursor-pointer hover:text-purple-600"
            onClick={() => window.open("https://wa.me/+918005842524", "_blank")}
          />

          {/* Email */}
          <EnvelopeSimple
            size={32}
            className="cursor-pointer hover:text-purple-600"
            onClick={() => window.open("mailto:whimsyweaverss@gmail.com")}
          />

        </div>
      </div>
    </div>
  )
}
