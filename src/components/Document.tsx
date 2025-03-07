'use client';

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
import { useCollection } from "react-firebase-hooks/firestore"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import NewDocument from './NewDocument'
import { MenuIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { collectionGroup, DocumentData, query, where } from 'firebase/firestore'
import SidebarOption from './SidebarOption'
interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
}

const patterns = [
    "checkers", "colorslide", "concentric-circles", "crossdots", "diamond", "diagonal-stripes", "eye", "folding-page", "graph", "grid-dots", "heart", "honeycomb", "illusion", "paper", "moving-square", "polka-dots", "shattered-glass", "sun-rays", "sunburst", "wavy-lines", "zebra-stripes", "zig-zag"
];

const Document = ({ id }: { id: string }) => {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();

    // Retrieve pattern from localStorage or use default
    const [selectedPattern, setSelectedPattern] = useState(() => {
        return localStorage.getItem("selectedPattern") || "diagonal-stripes";
    });

    // Store selected pattern in localStorage
    useEffect(() => {
        localStorage.setItem("selectedPattern", selectedPattern);
    }, [selectedPattern]);

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

    const { user } = useUser();
    const [groupedData, setGroupedData] = React.useState<{ owner: RoomDocument[]; editor: RoomDocument[] }>({ owner: [], editor: [] });
    const [dat, loadin, erro] = useCollection(
        user && (
            query(
                collectionGroup(db, 'rooms'),
                where('userId', '==', user.emailAddresses[0].toString())
            )
        )
    );

    useEffect(() => {
        if (!dat) return;

        const grouped = dat.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>(
            (acc, curr) => {
                const roomData = curr.data() as RoomDocument;

                if (roomData.role === 'owner') {
                    acc.owner.push({
                        id: curr.id,
                        ...roomData,
                    });
                } else {
                    acc.editor.push({
                        id: curr.id,
                        ...roomData,
                    });
                }
                return acc;
            }, {
            owner: [],
            editor: [],
        }
        )
        setGroupedData(grouped);
    }, [dat]);

    const menuOptions = (
        <>
            <NewDocument />
            <div className='flex flex-col space-y-6 py-6'>
                {groupedData.owner.length === 0 ? (
                    <h2 className='text-gray-400 font-medium text-base'>No documents found</h2>
                ) : (
                    <>
                        <h2 className='text-gray-600 font-semibold text-lg border-b pb-2'>My Documents</h2>
                        {groupedData.owner.map((doc) => (
                            <SidebarOption key={doc.id} href={`/doc/${doc.id}`} id={doc.id} />
                        ))}
                    </>
                )}
            </div>
            {groupedData.editor.length > 0 && (
                <div className='mt-4'>
                    <h2 className='text-gray-600 font-semibold text-lg border-b pb-2'>Shared with me</h2>
                    {groupedData.editor.map((doc) => (
                        <SidebarOption key={doc.id} href={`/doc/${doc.id}`} id={doc.id} />
                    ))}
                </div>
            )}
        </>
    );



    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

    return (
        <div className="relative min-h-screen flex ">

            <div className={`absolute inset-0 ${selectedPattern} opacity-80 z-0`} />
            <div className='  md:p-4  shadow-xl rounded-xl md:rounded-2xl backdrop-blur-md border border-gray-300/50'>
                <div className='md:hidden'>
                    <Sheet>
                        <SheetTrigger>
                            <MenuIcon className='p-2 hover:bg-gray-300 transition rounded-lg' size={40} />
                        </SheetTrigger>
                        <SheetContent side='left' className='bg-white rounded-lg shadow-xl'>
                            <SheetHeader>
                                <SheetTitle className='text-lg font-bold'>Menu</SheetTitle>
                            </SheetHeader>
                            <div className='mt-4'>{menuOptions}</div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className='hidden md:block overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2'>
                    {menuOptions}
                </div>
            </div>

            <div className="w-full max-w-screen-xl p-8 md:p-12 mx-auto z-10">
                <div className="flex w-full justify-between items-center pb-5">
                    <form className="flex w-full space-x-2" onSubmit={updateTitle}>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter title"
                            disabled={isUpdating}
                            className="flex-1 px-4 py-2 border bg-white/60 shadow-md rounded-full border-gray-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <InviteUser />
                                <DeleteDocument />
                            </>
                        )}
                    </form>
                </div>

                <div className="flex w-full max-w-screen-xl mx-auto justify-between items-center mb-5">
                    <ManageUsers />

                    {/* Pattern Selection Dropdown */}
                    <div className="flex justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center space-x-3 ">
                            <label className="text-sm font-semibold text-gray-700">Select Background:</label>
                            <div className="relative">
                                <select
                                    value={selectedPattern}
                                    onChange={(e) => setSelectedPattern(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                >
                                    {patterns.map((pattern) => (
                                        <option key={pattern} value={pattern}>
                                            {pattern.replace("-", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <Avatars />
                </div>

                <hr className="w-full my-4" />
                <Editor />
            </div>
        </div>
    );
};

export default Document;
