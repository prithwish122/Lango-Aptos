"use client"
import Link from "next/link"
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const Navbar = () => {
    const { connected } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <img src="/rome.svg" alt="Rome" className="h-8 w-8" />
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-gray-600 hover:text-gray-900">Read Docs</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Twitter</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Join Waitlist</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar