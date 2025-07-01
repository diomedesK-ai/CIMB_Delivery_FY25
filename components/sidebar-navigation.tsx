"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  Users,
  Layers,
  Lightbulb,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function SidebarNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [activePath, setActivePath] = useState(pathname === "/" ? "/gtd-dashboard" : pathname)

  useEffect(() => {
    // If we're on the root path, consider GTD Dashboard as active since it redirects there
    setActivePath(pathname === "/" ? "/gtd-dashboard" : pathname)
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b pb-2">
            <div className="flex items-center gap-3 px-4 py-3">
              <img 
                src="/images/maybank-emblem.png" 
                alt="Maybank Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="font-semibold text-lg text-gray-800">Maybank</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/gtd-dashboard"}
                  className={activePath === "/gtd-dashboard" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/gtd-dashboard">
                    <BarChart3 className="h-5 w-5" />
                    <span>GTD Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/microsoft"}
                  className={activePath === "/microsoft" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/microsoft">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Microsoft</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/timeline"}
                  className={activePath === "/timeline" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/timeline">
                    <Calendar className="h-5 w-5" />
                    <span>Timeline</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/use-cases"}
                  className={activePath === "/use-cases" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/use-cases">
                    <Lightbulb className="h-5 w-5" />
                    <span>Use Cases</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/settings"}
                  className={activePath === "/settings" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/help"}
                  className={activePath === "/help" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/help">
                    <HelpCircle className="h-5 w-5" />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="p-4">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
