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
  Database,
  LogOut,
  Calculator,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { UniversalSearch } from "@/components/universal-search"

export function SidebarNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [activePath, setActivePath] = useState(pathname === "/" ? "/functions" : pathname)
  const { logout } = useAuth()

  useEffect(() => {
    // If we're on the root path, consider Strategic Functions as active since it redirects there
    setActivePath(pathname === "/" ? "/functions" : pathname)
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b pb-2">
            <div className="flex items-center gap-3 px-4 py-3">
              <img 
                src="/images/cimb-emblem.jpg" 
                alt="CIMB Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="font-semibold text-lg text-gray-800">CIMB</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/functions"}
                  className={activePath === "/functions" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/functions">
                    <Layers className="h-5 w-5" />
                    <span>Strategic Functions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/executive-timeline"}
                  className={activePath === "/executive-timeline" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/executive-timeline">
                    <Calendar className="h-5 w-5" />
                    <span>Strategic Timeline</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/roi-calculator"}
                  className={activePath === "/roi-calculator" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/roi-calculator">
                    <Calculator className="h-5 w-5" />
                    <span>ROI Calculator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activePath === "/use-cases/manage"}
                  className={activePath === "/use-cases/manage" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/use-cases/manage">
                    <Database className="h-5 w-5" />
                    <span>Manage Master Data</span>
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
                  isActive={activePath === "/methodology"}
                  className={activePath === "/methodology" ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500" : ""}
                >
                  <Link href="/methodology">
                    <FileText className="h-5 w-5" />
                    <span>Methodology & Sources</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1 flex justify-start">
              <UniversalSearch />
            </div>
          </div>
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
