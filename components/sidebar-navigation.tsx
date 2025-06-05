"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
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
import { MaybankLogo } from "@/components/maybank-logo"
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
  const [activePath] = useState("/")

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b pb-2">
            <div className="flex items-center gap-2 px-4 py-2">
              <MaybankLogo />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activePath === "/"}>
                  <Link href="/">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activePath === "/timeline"}>
                  <Link href="/timeline">
                    <Calendar className="h-5 w-5" />
                    <span>Timeline</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activePath === "/use-cases"}>
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
                <SidebarMenuButton asChild isActive={activePath === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activePath === "/help"}>
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
