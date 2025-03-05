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

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

    return (
        <div className="relative flex-1 h-full p-5">
            <div className={`absolute inset-0 ${selectedPattern} opacity-80 z-0`} />

            <div className="relative z-10">
                <div className="flex max-w-6xl mx-auto justify-between items-center pb-5">
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

                <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
                    <ManageUsers />

                    {/* Pattern Selection Dropdown */}
                    <div className="flex justify-center ">
                        <div className="bg-white shadow-lg p-2 rounded-l rounded-r flex items-center space-x-3 border border-gray-200">
                            <label className="text-sm font-semibold text-gray-700">Select Background:</label>
                            <div className="relative">
                                <select
                                    value={selectedPattern}
                                    onChange={(e) => setSelectedPattern(e.target.value)}
                                    className=" bg-gray-100 border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
