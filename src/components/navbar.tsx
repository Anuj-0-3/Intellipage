"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/nextjs'

import React from 'react'
import BreadCrumbs from './BreadCrumbs'



const Navbar = () => {

  const {user} = useUser()  

  return (
    <div className='font-serif flex items-center justify-between p-5 md:px-0 bg-gradient-to-r from-gray-800 to-gray-600 backdrop-blur-sm border-b border-gray-200 z-50 text-white'>
      {user &&(
        <h1 className='text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>{user?.firstName}
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
