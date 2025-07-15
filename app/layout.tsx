'use client';

import type React from "react"
import "@/app/globals.css"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { AuthProvider, useAuth } from "@/lib/auth"
import ProtectedRoute from "@/components/protected-route"
import { usePathname } from 'next/navigation'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <SidebarNavigation>{children}</SidebarNavigation>
    </ProtectedRoute>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>Maybank AI Value Map Dashboard</title>
        <meta name="description" content="Track AI initiatives, dependencies, and value creation across Maybank" />
        <meta name="generator" content="v0.dev" />
      </head>
      <body>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  )
}
