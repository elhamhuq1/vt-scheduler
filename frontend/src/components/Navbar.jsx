import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/schedule", label: "Schedule" }
  ];

  return (
    <nav className="bg-maroon-600 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-black font-bold text-xl">
          SchedSync
          <img src='assets/images/logo.webp' alt='VT Logo' className='inline-block ml-2 h-8 w-8' />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-black hover:text-orange-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  )

}

export default Navbar
