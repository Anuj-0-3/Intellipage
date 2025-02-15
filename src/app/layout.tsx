import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Metadata } from 'next'
import Navbar from "@/components/navbar"
import Sidebar from '@/components/Sidebar';



export const metadata: Metadata = { title: "Intellipage", description: "Think. Write. Sync. ✨", };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />

          <div className="flex min-h-screen">
            <Sidebar />
            <div className='flex-1 p-4 bg-gray-100 overflow-y-auto scroolbar-hide'>
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}