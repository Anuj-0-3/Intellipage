'use client'

import React, { FormEvent, useEffect, useState, useTransition } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const Document = ({ id }: { id: string }) => {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id))
    const [input, setInput] = useState("")
    const [isUpdating, startTransition] = useTransition()
    

    useEffect(() => {
        if (data) {
            setInput(data.title)
        }
    }, [data])

    const updateTitle = async (e: FormEvent) => {
        e.preventDefault()

        if (input.trim()) {
            startTransition(async () => {
                try {
                    await updateDoc(doc(db, "documents", id), {
                        title: input,
                    })
                } catch (error) {
                    console.error("Error updating document: ", error)
                }
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error loading document: {error.message}</div>
    }

    return (
        <div className='flex max-w-6xl mx-36 justify-between pb-5'>
            <form className='flex flex-1 space-x-2' onSubmit={updateTitle}>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter title"
                />
                <Button disabled={isUpdating} type="submit">
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
            </form>
        </div>
    )
}

export default Document
