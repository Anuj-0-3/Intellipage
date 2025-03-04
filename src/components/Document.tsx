'use client'

import React, { FormEvent, useEffect, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';

const Document = ({ id }: { id: string }) => {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();

    useEffect(() => {
        if (data?.title && data.title !== input) {
            setInput(data.title);
        }
    }, [data]);

    const updateTitle = async (e: FormEvent) => {
        e.preventDefault();

        if (!input.trim() || input === data?.title) return;

        startTransition(async () => {
            try {
                await updateDoc(doc(db, "documents", id), { title: input });
            } catch (error) {
                console.error("Error updating document:", error);
            }
        });
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

    return (
        <div className='flex-1 h-full bg-customGray p-5'>

        <div className="flex max-w-6xl mx-auto justify-between items-center pb-5">
        <form className="flex w-full space-x-2" onSubmit={updateTitle}>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter title"
                disabled={isUpdating}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            <Button
                disabled={isUpdating}
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                >
                {isUpdating ? "Updating..." : "Update"}
            </Button>

            {isOwner && (
                <>
                <InviteUser/>
                <DeleteDocument/>
                </>
            )}
             
        </form>
        </div>
        <div className='flex max-w-6xl ms-auto justify-between items-center mb-5'>
          <ManageUsers/>
          <Avatars/>
        </div>
        <hr className="w-full my-4" />
        <Editor />
    </div>

    );
};

export default Document;

