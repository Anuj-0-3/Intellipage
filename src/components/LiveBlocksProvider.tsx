'use client'
import React from 'react'
import { LiveblocksProvider } from '@liveblocks/react/suspense'

const LiveBlocksProvider = ({children}:{children:React.ReactNode}) => {
    if(!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY){
        throw new Error("You need to set the NEXT_PUBLIC_LIVEBLOCKS_API_KEY environment variable")
    }
  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/auth-endpoint"}>
      {children}
    </LiveblocksProvider>
  )
}

export default LiveBlocksProvider
