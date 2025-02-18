"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/nextjs'

import React from 'react'
import BreadCrumbs from './BreadCrumbs'



const Navbar = () => {

  const {user} = useUser()  

  return (
    <div className='flex items-center justify-between p-5 bg-gray-800 text-white'>
      {user &&(
        <h1 className='text-2xl'>{user?.firstName}
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
