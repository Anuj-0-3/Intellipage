"use client";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NewDocument from "@/components/NewDocument";
import { MenuIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import SidebarOption from "@/components/SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{ owner: RoomDocument[]; editor: RoomDocument[] }>({ owner: [], editor: [] });

  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0]?.toString())
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
        acc[roomData.role === "owner" ? "owner" : "editor"].push({
          id: curr.id,
          ...roomData,
        });
        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <div className="space-y-6">
      <NewDocument />
      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">Loading documents...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">Failed to load documents.</p>
      ) : (
        <>
          {groupedData.owner.length > 0 ? (
            <div>
              <h2 className="text-gray-700 font-semibold text-lg border-b pb-2">My Documents</h2>
              {groupedData.owner.map((doc) => (
                <SidebarOption key={doc.id} href={`/doc/${doc.id}`} id={doc.id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-medium text-sm">No documents found</p>
          )}
          {groupedData.editor.length > 0 && (
            <div className="mt-4">
              <h2 className="text-gray-700 font-semibold text-lg border-b pb-2">Shared with Me</h2>
              {groupedData.editor.map((doc) => (
                <SidebarOption key={doc.id} href={`/doc/${doc.id}`} id={doc.id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <aside className="p-4 md:p-6 bg-white shadow-xl rounded-xl md:rounded-2xl backdrop-blur-lg border border-gray-300/50">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:bg-gray-200 transition rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left" className="bg-white rounded-lg shadow-xl">
            <SheetHeader>
              <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{menuOptions}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
        {menuOptions}
      </div>
    </aside>
  );
};

export default Sidebar;
