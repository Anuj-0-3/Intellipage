'use client'
import React from 'react'
import { ClientSideSuspense, RoomProvider as RoomProviderWrapper } from '@liveblocks/react'
import LoadingSpinner from './LoadingSpinner';

const RoomProvider = ({roomId, children}:{roomId:string;children:React.ReactNode;}) => {
  return (
    <RoomProviderWrapper id={roomId} initialPresence={{cursor:null}} >   
      <ClientSideSuspense fallback={<LoadingSpinner/>}>

      {children}
      </ClientSideSuspense>
    </RoomProviderWrapper>
  )
}

export default RoomProvider
