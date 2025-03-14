import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { adminDb } from "../../../firebase-admin";

export async function POST(req:NextRequest) {
    auth.protect()
    const { sessionClaims}= await auth();
    const { room }= await req.json();
    
   

    const session = liveblocks.prepareSession(sessionClaims?.email ?? "", {
        userInfo: {
            name: sessionClaims?.fullName ?? "Unknown User",
            email: sessionClaims?.email ?? "",
            avatar: sessionClaims?.image ?? "/default-avatar.png",
        }
    });
    

    

    const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId","==",sessionClaims?.email)
    .get();

    const userInRoom = usersInRoom.docs.find((doc)=>doc.id === room);

    if(userInRoom?.exists){
       session.allow(room,session.FULL_ACCESS)
       const {body,status}= await session.authorize();

       return new Response(body,{status});
    }else{
        return new Response("Unauthorized",{status:401});
    }
}