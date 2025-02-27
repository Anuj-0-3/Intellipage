'use client'
import { useRoom, useSelf } from '@liveblocks/react/suspense'
import React, { use, useEffect, useState } from 'react'
import * as Y from 'yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { Button } from './ui/button'
import {  MoonIcon, SunIcon } from 'lucide-react'
import {BlockNoteView} from "@blocknote/shadcn"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import { BlockNoteEditor } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import stringToColor from '@/lib/stringToColor'

type EditorProps = {
  doc: Y.Doc,
  provider:any,
  darkmode:boolean,
}

function BlockNote({doc, provider, darkmode}:EditorProps) {
  const userInfo=useSelf((me)=>me.info)

  const editor:BlockNoteEditor=useCreateBlockNote({
    collaboration:{
      provider,
      fragment:doc.getXmlFragment('document-store'),
      user:{
        name:userInfo?.name,
        color: stringToColor(userInfo?.email)
      }
    }
  })


  return(
    <div className='relative max-w-6xl mx-auto'>
      <BlockNoteView
        className='min-h-screen'
        editor={editor}
        theme={darkmode ? 'dark' : 'light'}
        />
    </div>
  )
}


const Editor = () => {
  const room = useRoom()
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<LiveblocksYjsProvider>()
  const [darkmode, setDarkmode] = useState<boolean>(false)
  const style = `hover:text-white ${darkmode
    ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
    : "text-gray-800 bg-gray-300 hover:bg-gray-300 hover:text-gray-700"}`
  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    setDoc(yDoc)
    setProvider(yProvider)

    return()=>{
      yDoc?.destroy()
      yProvider?.destroy()
    }
  }, [room])
 if (!doc || !provider) {
    return null
  }


  return (
    <div>
      <div className='flex items-center justify-end gap-2 mb-10'>

        {/* TranslateDocumentAI */}
        {/* {chatdocumentai} */}
        <Button className={style} onClick={() => setDarkmode(!darkmode)}>
          {darkmode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {/* Blocknotes */}
      <BlockNote doc={doc} provider={provider} darkmode={darkmode} />

    </div>
  )
}

export default Editor
