import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b1220] text-gray-300 mx-1 mt-2">
      
      {/* Top */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-pink-500 mb-3">ECOMMARCE</h2>
          <p className="text-sm mb-3">
            Powering Your World with the Best in Electronics.
          </p>
          <p className="text-sm">123 Electronics St, NY</p>
          <p className="text-sm">support@ecommerce.com</p>
          <p className="text-sm">(123) 456-7890</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-pink-500 cursor-pointer">Shipping</li>
            <li className="hover:text-pink-500 cursor-pointer">FAQs</li>
            <li className="hover:text-pink-500 cursor-pointer">Tracking</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <FaFacebookF className="w-5 h-5 cursor-pointer hover:text-pink-500" />
            <FaInstagram className="w-5 h-5 cursor-pointer hover:text-pink-500" />
            <FaTwitter className="w-5 h-5 cursor-pointer hover:text-pink-500" />
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-4">Get updates & offers</p>

          <div className="flex">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-gray-800 text-sm rounded-l-md focus:outline-none"
            />
            <button className="bg-pink-500 px-4 py-2 rounded-r-md text-white text-sm hover:bg-pink-600">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © 2025 <span className="text-pink-500 font-semibold">ECOMMARCE</span>
      </div>
    </footer>
  );
};

export default Footer;