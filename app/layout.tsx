import type React from "react"
import "@/app/globals.css"
import { SidebarNavigation } from "@/components/sidebar-navigation"

export const metadata = {
  title: "Maybank AI Value Map Dashboard",
  description: "Track AI initiatives, dependencies, and value creation across Maybank",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarNavigation>{children}</SidebarNavigation>
      </body>
    </html>
  )
}
