'use client'
import { useMyPresence, useOthers } from '@liveblocks/react'
import React from 'react'

const LiveCursorProvider = ({children}:{children:React.ReactNode}) => {
    const [myPresence,updateMyPresence]=useMyPresence()
    const others =useOthers()
    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>){
        const cursor = {x: Math.floor(e.pageX),y:Math.floor(e.pageY)}
        updateMyPresence({cursor})
    }
    function handlePointerLeave(){
        updateMyPresence({cursor:null})
    }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others.filter((other)=> other.presence.cursor !== null).map((connectionId,presence,info))=>(
        <FollowPointer key={others.id}/>
      )}
    </div>
  )
}

export default LiveCursorProvider
