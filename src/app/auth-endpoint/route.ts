import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";

export async function POST(req: NextRequest) {
  const authResult = await auth();
  const userId = authResult?.userId;
  const { room } = await req.json();

  console.log("DEBUG: userId =", userId, "| type =", typeof userId);
  console.log("DEBUG: room =", room);

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    return new Response("Unauthorized: Invalid or missing userId", { status: 401 });
  }

  if (!room || typeof room !== "string") {
    return new Response("Invalid room", { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? `${userId}@example.com`;
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const avatar = user?.imageUrl ?? "/default-avatar.png";

  const session = liveblocks.prepareSession(
    userId, // ✅ pass as string, not object!
    {
      userInfo: {
        name: name || "Anonymous",
        email,
        avatar,
      },
    }
  );

  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
