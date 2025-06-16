"use client"
import Link from "next/link"
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const Navbar = () => {
    const { connected } = useWallet();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with glassmorphism effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"></div>
      
      {/* Gradient border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-24">
          {/* Logo section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/rome.svg" alt="Rome" className="h-10 w-10" />
              {/* Subtle glow effect around logo */}
              <div className="absolute inset-0 h-10 w-10 bg-blue-500/20 rounded-full blur-md -z-10"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">Rome Protocol</span>
          </div>
          
          {/* Navigation links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="#" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Start Learning
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Features
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Get Tokens
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Documentation
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Twitter / X
            </Link>
            <Link 
              href="#" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 transform"
            >
              Join Waitlist
            </Link>
            
            {/* Wallet connection status indicator */}
            {connected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
    </nav>
  )
}

export default Navbar