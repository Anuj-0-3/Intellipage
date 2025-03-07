'use client'
import React, { useEffect } from 'react'
import { useCollection } from "react-firebase-hooks/firestore"
import NewDocument from '@/components/NewDocument'
import { useUser } from '@clerk/nextjs'
import { collectionGroup, DocumentData, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import SidebarOption from '@/components/SidebarOption'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = React.useState<{ owner: RoomDocument[]; editor: RoomDocument[] }>({ owner: [], editor: [] });
  const [data, loading, error] = useCollection(
    user && (
      query(
        collectionGroup(db, 'rooms'),
        where('userId', '==', user.emailAddresses[0].toString())
      )
    )
  );

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
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
  }, [data]);

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to IntelliPage</h1>
        <p className="text-gray-600 text-lg">
          Create, collaborate, and enhance your documents effortlessly. Whether you're brainstorming ideas, managing projects, or taking notes, IntelliPage gives you the flexibility and ease of Notion—plus more.
        </p>
        <div className="space-y-2 text-gray-700">
          <p>🚀 <span className="font-semibold">Live Collaboration</span> – Work with your team in real-time, no matter where they are.</p>
          <p>🤖 <span className="font-semibold">AI Assistance</span> – Get smart suggestions, summaries, and content generation on the go.</p>
          <p>📑 <span className="font-semibold">Seamless Organization</span> – Keep your work structured with an intuitive document system.</p>
        </div>
        <NewDocument />
        <div>Or go to your created doc <Link href="/doc"><Button>Go to doc</Button></Link></div>
      </div>
    </div>
  )
}

export default Sidebar;