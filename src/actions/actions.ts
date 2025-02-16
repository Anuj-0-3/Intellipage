'use server'

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebase-admin";

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
