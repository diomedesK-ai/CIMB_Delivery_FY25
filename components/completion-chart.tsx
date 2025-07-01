"use client"

import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GTDItem } from "@/app/gtd-dashboard/page"

interface CompletionChartProps {
  items: GTDItem[]
}

export function CompletionChart({ items }: CompletionChartProps) {
  const [groupBy, setGroupBy] = useState<'theme' | 'category' | 'progress'>('theme')

  const progressData = useMemo(() => {
    const progressCounts = items.reduce((acc, item) => {
      acc[item.progress] = (acc[item.progress] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { name: "Not Started", count: progressCounts["not started"] || 0, color: "#6B7280" },
      { name: "On Track", count: progressCounts["on track"] || 0, color: "#10B981" },
      { name: "Delayed", count: progressCounts["delayed"] || 0, color: "#EF4444" },
    ]
  }, [items])

  const categoryData = useMemo(() => {
    const categoryCounts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { name: "Conceptual", count: categoryCounts["conceptual"] || 0, color: "#3B82F6" },
      { name: "Implementation", count: categoryCounts["implementation"] || 0, color: "#10B981" },
      { name: "Planning", count: categoryCounts["planning"] || 0, color: "#F59E0B" },
    ]
  }, [items])

  const themeData = useMemo(() => {
    const themeProgress = items.reduce((acc, item) => {
      if (!acc[item.theme]) {
        acc[item.theme] = {
          theme: item.theme,
          total: 0,
          onTrack: 0,
          delayed: 0,
          notStarted: 0,
          conceptual: 0,
          implementation: 0,
          planning: 0
        }
      }
      
      acc[item.theme].total += 1
      
      // Progress tracking
      switch (item.progress) {
        case "on track":
          acc[item.theme].onTrack += 1
          break
        case "delayed":
          acc[item.theme].delayed += 1
          break
        case "not started":
          acc[item.theme].notStarted += 1
          break
      }

      // Category tracking
      switch (item.category) {
        case "conceptual":
          acc[item.theme].conceptual += 1
          break
        case "implementation":
          acc[item.theme].implementation += 1
          break
        case "planning":
          acc[item.theme].planning += 1
          break
      }
      
      return acc
    }, {} as Record<string, any>)

    return Object.values(themeProgress)
  }, [items])

  const groupedData = useMemo(() => {
    if (groupBy === 'theme') {
      return themeData.map(theme => ({
        name: theme.theme.replace(/^T\d+:\s*/, ''), // Remove T1:, T2: etc prefix for cleaner display
        onTrack: theme.onTrack || 0,
        delayed: theme.delayed || 0,
        notStarted: theme.notStarted || 0,
        total: theme.total || 0
      }))
    } else if (groupBy === 'category') {
      return categoryData.map(cat => ({
        name: cat.name,
        count: cat.count || 0,
        color: cat.color
      }))
    } else {
      return progressData.map(prog => ({
        name: prog.name,
        count: prog.count || 0,
        color: prog.color
      }))
    }
  }, [groupBy, themeData, categoryData, progressData])

  const completionRate = useMemo(() => {
    const onTrack = items.filter(item => item.progress === "on track").length
    return items.length > 0 ? Math.round((onTrack / items.length) * 100) : 0
  }, [items])

  const COLORS = ["#6B7280", "#10B981", "#EF4444", "#3B82F6", "#F59E0B"]

  // Debug information
  console.log('Chart Debug:', {
    totalItems: items.length,
    groupBy,
    themeDataLength: themeData.length,
    categoryDataLength: categoryData.length,
    progressDataLength: progressData.length,
    groupedData: groupedData.slice(0, 3), // First 3 items for debugging
  })

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      {items.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Debug:</strong> No items found. Total items: {items.length}
        </div>
      )}
      
      {/* Chart Controls */}
      <div className="flex items-center gap-4">
        <label htmlFor="chartGroupBy" className="text-sm font-medium">Chart view:</label>
        <Select value={groupBy} onValueChange={(value: 'theme' | 'category' | 'progress') => setGroupBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="theme">By Theme</SelectItem>
            <SelectItem value="category">By Category</SelectItem>
            <SelectItem value="progress">By Progress</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-500">
          Total: {items.length} items, Grouped: {groupedData.length} groups
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {groupBy === 'theme' ? 'Progress by Theme' : 
               groupBy === 'category' ? 'Distribution by Category' : 
               'Distribution by Progress'}
            </CardTitle>
            <CardDescription>
              {groupBy === 'theme' ? 'Task progress breakdown across themes' :
               groupBy === 'category' ? 'Task breakdown by category type' :
               'Overall progress status distribution'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {groupBy === 'theme' ? (
                <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="onTrack" stackId="a" fill="#10B981" name="On Track" />
                  <Bar dataKey="delayed" stackId="a" fill="#EF4444" name="Delayed" />
                  <Bar dataKey="notStarted" stackId="a" fill="#6B7280" name="Not Started" />
                </BarChart>
              ) : (
                <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Overview Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Progress</CardTitle>
            <CardDescription>Completion rate: {completionRate}%</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData.filter(item => item.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count, percent }) => `${name}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
            <CardDescription>Initiative types distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.filter(item => item.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count, percent }) => `${name}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Theme Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme Summary</CardTitle>
            <CardDescription>Progress overview by theme areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {themeData.map((theme, index) => {
                const progressRate = theme.total > 0 ? Math.round((theme.onTrack / theme.total) * 100) : 0
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{theme.theme}</div>
                      <div className="text-xs text-gray-600">
                        {theme.total} initiatives • {progressRate}% on track
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">{theme.onTrack}</div>
                      <div className="text-xs text-gray-500">on track</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 