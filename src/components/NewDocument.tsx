"use client"
import React, { useTransition } from 'react'
import { useRouter } from "next/navigation"
import { Button } from './ui/button'
import { createNewDocument } from '@/actions/actions'

const NewDocument = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <div>
      <Button onClick={handleCreateNewDocument} disabled={isPending}>
        {isPending ? "Creating..." : "New Document"}
      </Button>
    </div>
  )
}

export default NewDocument
