import {ClerkProvider} from '@clerk/nextjs'
import './globals.css'
import { Metadata } from 'next'
import Navbar from "@/components/navbar"



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
          <Navbar/>

          <div className="container mx-auto px-4"></div>


          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}