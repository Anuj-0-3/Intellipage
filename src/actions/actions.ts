'use server'

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebase-admin";
import liveblocks from "@/lib/liveblocks";

export async function createNewDocument() {
    auth.protect(); // Ensures only authenticated users can access

    const { sessionClaims } = await auth();

    // Retrieve email safely
    const userEmail = (sessionClaims?.email || sessionClaims?.primary_email_address) as string;

    if (!userEmail) {
        console.error("No valid email found in session claims:", sessionClaims);
        throw new Error("User email is missing or invalid.");
    }

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    });

    // Store the document under the user's collection
    await adminDb.collection("users").doc(userEmail).collection("rooms").doc(docRef.id).set({
        userId: userEmail,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id  
    });

    return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
    auth.protect(); 
    console.log("Deleting document:", roomId);

    try {
        await adminDb.collection("documents").doc(roomId).delete();

        const query=await adminDb
        .collectionGroup("rooms")
        .where("roomId","==",roomId)
        .get();

        const batch = adminDb.batch();

        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        await liveblocks.deleteRoom(roomId);
        return { success: true };
    } catch (error) {
        console.error("Error deleting document:", error);
        return { success: false };
    }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth.protect();
  console.log("Inviting user to document:", roomId, email);
  try{
      await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
          userId: email,
          role: "editor",
          createdAt: new Date(),
          roomId,
        })
        return { success: true };
  }catch(error){
    console.error("Error adding user:", error);
        return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
    auth.protect();
    console.log("Removing user from document:", roomId, email);
    try {
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .delete();

        return { success: true };
        
    } catch (error) {
        console.error("Error removing user:", error);
        return { success: false };
    }
}