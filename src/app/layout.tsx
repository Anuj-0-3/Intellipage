import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Metadata } from 'next'
import Navbar from "@/components/navbar"
import { Toaster } from '@/components/ui/sonner';


export const metadata: Metadata = { 
  title: "Intellipage", 
  description: "Think. Write. Sync. ✨" 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className=""> 
          <Navbar />
          <div className="flex min-h-screen">
            {/* <Sidebar /> */}
            <main className='flex-1 overflow-y-auto scrollbar-hide'>
              {children}
            </main>
          </div>
          <Toaster position='top-center'/>
        </body>
      </html>
    </ClerkProvider>
  )
}
