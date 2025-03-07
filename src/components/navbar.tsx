"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/nextjs'

import React from 'react'
import BreadCrumbs from './BreadCrumbs'



const Navbar = () => {

  const { user } = useUser()

  return (
    <div className="relative font-serif flex items-center justify-between px-6 md:px-10 py-4 bg-gradient-to-r from-orange-400 to-red-600 backdrop-blur-md border-b border-gray-300 shadow-md text-white z-50">

      {/* Left - User's Space */}
      {user && (
        <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-[0_4px_10px_rgba(255,255,255,0.4)]">
          {user?.firstName}{`'s `} Space
        </h1>


      )}

      {/* Center - Breadcrumb (Takes up available space) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <BreadCrumbs />
      </div>

      {/* Right - Sign-in / User Actions */}
      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar
