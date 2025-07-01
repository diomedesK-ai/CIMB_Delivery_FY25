"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileIcon as FilePresentation, Filter } from "lucide-react"
import { GTDTable } from "@/components/gtd-table"
import { CompletionChart } from "@/components/completion-chart"
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export interface GTDItem {
  id: string
  task: string
  theme: string
  category: "conceptual" | "implementation" | "planning"
  progress: "not started" | "on track" | "delayed"
  approval: "approval obt: entry" | "approval obt: MK" | "JD" | "Faiz" | "Suthesh" | "Soong" | "Patrick" | "Ravi SG" | "Kalyani" | "Jason" | "WTL" | "MK" | "Safriya"
  assignee: string
}

export default function GTDDashboard() {
  const [items, setItems] = useState<GTDItem[]>([
    // T1: Strong Foundation (12 items)
    {
      id: "1",
      task: "Layered Tech - EA Platform Digitization (EA Tool)",
      theme: "T1: Strong Foundation",
      category: "planning",
      progress: "on track",
      approval: "approval obt: entry",
      assignee: "Tech Team"
    },
    {
      id: "2", 
      task: "Layered Tech - Platform Architecture Design",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "not started",
      approval: "approval obt: MK",
      assignee: "Platform Team"
    },
    {
      id: "3",
      task: "Tech Debt reduction - Core banking transformation",
      theme: "T1: Strong Foundation",
      category: "implementation",
      progress: "delayed",
      approval: "MK",
      assignee: "Core Banking Team"
    },
    {
      id: "4",
      task: "Tech Debt reduction - Improve Mainframe HA",
      theme: "T1: Strong Foundation",
      category: "implementation", 
      progress: "on track",
      approval: "JD",
      assignee: "Infrastructure Team"
    },
    {
      id: "5",
      task: "Tech Debt reduction - Data center modernisation (all countries)",
      theme: "T1: Strong Foundation",
      category: "implementation",
      progress: "on track",
      approval: "JD",
      assignee: "Infrastructure Team"
    },
    {
      id: "6",
      task: "Tech Debt reduction - NTJDC",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "on track",
      approval: "JD",
      assignee: "Infrastructure Team"
    },
    {
      id: "7",
      task: "DR Overhaul - Resilience Operation center",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "delayed",
      approval: "Faiz",
      assignee: "DR Team"
    },
    {
      id: "8",
      task: "DR Overhaul - DR Automation",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "not started",
      approval: "Faiz",
      assignee: "DR Team"
    },
    {
      id: "9",
      task: "Effective Testing Environment - Centralise Quality Assurance",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "not started",
      approval: "Suthesh",
      assignee: "QA Team"
    },
    {
      id: "10",
      task: "Define Data foundations for customer centric views, cloud and ai adoption",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "not started",
      approval: "Soong",
      assignee: "Data Team"
    },
    {
      id: "11",
      task: "Tighten production controls, reduce freeze periods",
      theme: "T1: Strong Foundation",
      category: "implementation",
      progress: "on track",
      approval: "Suthesh",
      assignee: "Production Team"
    },
    {
      id: "12",
      task: "Regularly audit technology assets",
      theme: "T1: Strong Foundation",
      category: "conceptual",
      progress: "not started",
      approval: "Jason",
      assignee: "Audit Team"
    },

    // T2: Embracing the New (4 items)
    {
      id: "13",
      task: "Public Cloud Adoption",
      theme: "T2: Embracing the New",
      category: "planning",
      progress: "on track",
      approval: "Soong",
      assignee: "Cloud Team"
    },
    {
      id: "14",
      task: "AI Integration at scale",
      theme: "T2: Embracing the New",
      category: "planning",
      progress: "on track",
      approval: "Soong",
      assignee: "AI Team"
    },
    {
      id: "15",
      task: "Comprehensive Security Strategy",
      theme: "T2: Embracing the New",
      category: "conceptual",
      progress: "not started",
      approval: "Patrick",
      assignee: "Security Team"
    },
    {
      id: "16",
      task: "Explore Partnerships with fintech and startups",
      theme: "T2: Embracing the New",
      category: "conceptual",
      progress: "not started",
      approval: "Ravi SG",
      assignee: "Innovation Team"
    },

    // T3: Digital Strategy (4 items)
    {
      id: "17",
      task: "Growing Marketshare for 5G, ID",
      theme: "T3: Digital Strategy",
      category: "conceptual",
      progress: "not started",
      approval: "Kalyani",
      assignee: "Digital Team"
    },
    {
      id: "18",
      task: "Deepening wallet for MV",
      theme: "T3: Digital Strategy",
      category: "conceptual",
      progress: "not started",
      approval: "Kalyani",
      assignee: "MV Team"
    },
    {
      id: "19",
      task: "Scaling key features to grow KH, PH",
      theme: "T3: Digital Strategy",
      category: "conceptual",
      progress: "not started",
      approval: "Kalyani",
      assignee: "Regional Team"
    },
    {
      id: "20",
      task: "Enhancing brand value via digital",
      theme: "T3: Digital Strategy",
      category: "conceptual",
      progress: "not started",
      approval: "Kalyani",
      assignee: "Brand Team"
    },

    // T4: Way of Working (5 items)
    {
      id: "21",
      task: "Procurement approach modernization",
      theme: "T4: Way of Working",
      category: "planning",
      progress: "on track",
      approval: "Suthesh",
      assignee: "Procurement Team"
    },
    {
      id: "22",
      task: "Redesign of IT project delivery",
      theme: "T4: Way of Working",
      category: "planning",
      progress: "on track",
      approval: "Safriya",
      assignee: "Project Team"
    },
    {
      id: "23",
      task: "Process redesign",
      theme: "T4: Way of Working",
      category: "planning",
      progress: "on track",
      approval: "Safriya",
      assignee: "Process Team"
    },
    {
      id: "24",
      task: "Enhanced incident management",
      theme: "T4: Way of Working",
      category: "planning",
      progress: "on track",
      approval: "Faiz",
      assignee: "Operations Team"
    },
    {
      id: "25",
      task: "Microsoft 365 & Security Services",
      theme: "T4: Way of Working",
      category: "planning",
      progress: "on track",
      approval: "JD",
      assignee: "IT Services Team"
    },

    // T5: Team & Culture (4 items)
    {
      id: "26",
      task: "Optimised Talent Allocation",
      theme: "T5: Team & Culture",
      category: "implementation",
      progress: "on track",
      approval: "WTL",
      assignee: "HR Team"
    },
    {
      id: "27",
      task: "Right Decisions At The Right Place-Increase Delegation Of Authority",
      theme: "T5: Team & Culture",
      category: "implementation",
      progress: "on track",
      approval: "Kalyani",
      assignee: "Leadership Team"
    },
    {
      id: "28",
      task: "Align Skill Mix To Current And Future Needs",
      theme: "T5: Team & Culture",
      category: "planning",
      progress: "on track",
      approval: "MK",
      assignee: "HR Team"
    },
    {
      id: "29",
      task: "Organise The Tech Strategy As A Holistic Change Management Project",
      theme: "T5: Team & Culture",
      category: "planning",
      progress: "delayed",
      approval: "Safriya",
      assignee: "Change Management Team"
    }
  ])

  const updateItemProgress = (id: string, newProgress: GTDItem['progress']) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, progress: newProgress } : item
      )
    )
  }

  const updateItem = (id: string, updatedItem: Partial<GTDItem>) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    )
  }

  // Calculate counts for Task Management section
  const overallCounts = {
    total: items.length,
    conceptual: items.filter(item => item.category === 'conceptual').length,
    implementation: items.filter(item => item.category === 'implementation').length,
    planning: items.filter(item => item.category === 'planning').length,
    onTrack: items.filter(item => item.progress === 'on track').length,
  }

  // Theme progress data for circular charts
  const themes = ['T1: Strong Foundation', 'T2: Embracing the New', 'T3: Digital Strategy', 'T4: Way of Working', 'T5: Team & Culture']
  const themeProgressData = themes.map(theme => {
    const themeItems = items.filter(item => item.theme === theme)
    const onTrack = themeItems.filter(item => item.progress === 'on track').length
    const notStarted = themeItems.filter(item => item.progress === 'not started').length  
    const delayed = themeItems.filter(item => item.progress === 'delayed').length

    return {
      theme: theme.replace('T1: ', '').replace('T2: ', '').replace('T3: ', '').replace('T4: ', '').replace('T5: ', ''),
      data: [
        { name: 'On Track', value: onTrack || 0, color: '#10B981' },
        { name: 'Not Started', value: notStarted || 0, color: '#F59E0B' },
        { name: 'Delayed', value: delayed || 0, color: '#EF4444' }
      ].filter(item => item.value > 0)
    }
  })

  return (
    <div className="space-y-6">
      {/* GTD Dashboard Header - At the Very Top */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">GTD Dashboard</h1>
          <p className="text-muted-foreground">Track and manage delivery tasks with completion analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden gap-1 sm:flex">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm" className="gap-1 bg-[#FFC107] text-black hover:bg-[#FFB300]">
            <FilePresentation className="h-4 w-4" />
            Export to PPT
          </Button>
        </div>
      </div>

      {/* Real Time Exec KPIs Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Real Time Exec KPIs</h2>
          <p className="text-gray-600 mb-8">Edit task status and details in real-time</p>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">Conceptual</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {overallCounts.total > 0 ? Math.round((overallCounts.conceptual / overallCounts.total) * 100) : 0}<span className="text-3xl">%</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">{overallCounts.conceptual} initiatives</div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">Planning</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {overallCounts.total > 0 ? Math.round((overallCounts.planning / overallCounts.total) * 100) : 0}<span className="text-3xl">%</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">{overallCounts.planning} initiatives</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">Implementation</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {overallCounts.total > 0 ? Math.round((overallCounts.implementation / overallCounts.total) * 100) : 0}<span className="text-3xl">%</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">{overallCounts.implementation} initiatives</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">Monitoring</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                0<span className="text-3xl">%</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">0 initiatives</div>
            </CardContent>
          </Card>
        </div>

                 {/* Executive Summary */}
         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
           <Card className="border border-gray-200 shadow-sm bg-white">
             <CardContent className="p-6 text-center">
               <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Total Initiatives</div>
               <div className="text-3xl font-bold text-gray-900">{overallCounts.total}</div>
             </CardContent>
           </Card>
           
           <Card className="border border-gray-200 shadow-sm bg-white">
             <CardContent className="p-6 text-center">
               <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">On Track</div>
               <div className="text-3xl font-bold text-green-600">{overallCounts.onTrack}</div>
             </CardContent>
           </Card>

           <Card className="border border-gray-200 shadow-sm bg-white">
             <CardContent className="p-6 text-center">
               <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Completion Rate</div>
               <div className="text-3xl font-bold text-gray-900">
                 {Math.round((overallCounts.onTrack / overallCounts.total) * 100)}<span className="text-xl">%</span>
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Theme Progress Circles */}
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
           {themeProgressData.map((themeData, index) => (
             <Card key={index} className="border border-gray-200 shadow-sm bg-white">
               <CardContent className="p-6 text-center">
                 <h3 className="text-sm font-medium text-gray-700 mb-4">{themeData.theme}</h3>
                 <div className="relative w-32 h-32 mx-auto mb-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={themeData.data}
                         cx="50%"
                         cy="50%"
                         innerRadius={40}
                         outerRadius={60}
                         paddingAngle={2}
                         dataKey="value"
                       >
                         {themeData.data.map((entry, entryIndex) => (
                           <Cell key={`cell-${entryIndex}`} fill={entry.color} />
                         ))}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="space-y-1 text-xs">
                   {themeData.data.map((entry, entryIndex) => (
                     <div key={entryIndex} className="flex items-center justify-start gap-2">
                       <div 
                         className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: entry.color }}
                       ></div>
                       <span className="text-gray-600">{entry.name}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>

      <div className="grid gap-6">
        {/* Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Overview</CardTitle>
            <CardDescription>Visual breakdown of task completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionChart items={items} />
          </CardContent>
        </Card>

        {/* Editable GTD Table */}
        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>Edit task status and details in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <GTDTable 
              items={items} 
              onUpdateProgress={updateItemProgress}
              onUpdateItem={updateItem}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 