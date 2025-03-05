"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/nextjs'

import React from 'react'
import BreadCrumbs from './BreadCrumbs'



const Navbar = () => {

  const {user} = useUser()  

  return (
    <div className='font-serif flex items-center justify-between p-5 md:px-0 bg-gradient-to-r from-orange-400 to-orange-700 backdrop-blur-sm border-b border-gray-200 z-50 text-white'>
      {user &&(
       <h1 className="ml-10 text-2xl bg-gradient-to-r from-gray-100 to-gray-100 bg-clip-text text-transparent [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">{user?.firstName}
        {`'s `}Space</h1>
      )}

      <BreadCrumbs />

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>


    </div>
  )
}

export default Navbar
