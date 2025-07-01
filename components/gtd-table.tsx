"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Check, X } from "lucide-react"
import type { GTDItem } from "@/app/gtd-dashboard/page"

interface GTDTableProps {
  items: GTDItem[]
  onUpdateProgress: (id: string, progress: GTDItem['progress']) => void
  onUpdateItem: (id: string, updatedItem: Partial<GTDItem>) => void
}

export function GTDTable({ items, onUpdateProgress, onUpdateItem }: GTDTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<GTDItem>>({})
  const [groupBy, setGroupBy] = useState<'theme' | 'category' | 'progress'>('theme')

  const getCategoryColor = (category: GTDItem['category']) => {
    switch (category) {
      case "conceptual":
        return "bg-blue-100 text-blue-800"
      case "implementation":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: GTDItem['progress']) => {
    switch (progress) {
      case "on track":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "delayed":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "not started":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const groupedItems = useMemo(() => {
    const groups = items.reduce((acc, item) => {
      const key = item[groupBy]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {} as Record<string, GTDItem[]>)

    return Object.entries(groups).map(([groupName, groupItems]) => ({
      groupName,
      items: groupItems,
      counts: {
        total: groupItems.length,
        conceptual: groupItems.filter(item => item.category === 'conceptual').length,
        implementation: groupItems.filter(item => item.category === 'implementation').length,
        planning: groupItems.filter(item => item.category === 'planning').length,
        onTrack: groupItems.filter(item => item.progress === 'on track').length,
        delayed: groupItems.filter(item => item.progress === 'delayed').length,
        notStarted: groupItems.filter(item => item.progress === 'not started').length,
      }
    }))
  }, [items, groupBy])

  const overallCounts = useMemo(() => ({
    total: items.length,
    conceptual: items.filter(item => item.category === 'conceptual').length,
    implementation: items.filter(item => item.category === 'implementation').length,
    planning: items.filter(item => item.category === 'planning').length,
    onTrack: items.filter(item => item.progress === 'on track').length,
    delayed: items.filter(item => item.progress === 'delayed').length,
    notStarted: items.filter(item => item.progress === 'not started').length,
  }), [items])

  const startEditing = (item: GTDItem) => {
    setEditingId(item.id)
    setEditForm(item)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEditing = () => {
    if (editingId && editForm) {
      onUpdateItem(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div>Conceptual: {overallCounts.conceptual}</div>
              <div>Implementation: {overallCounts.implementation}</div>
              <div>Planning: {overallCounts.planning}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div>On Track: {overallCounts.onTrack}</div>
              <div>Delayed: {overallCounts.delayed}</div>
              <div>Not Started: {overallCounts.notStarted}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((overallCounts.onTrack / overallCounts.total) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group By Controls */}
      <div className="flex items-center gap-4">
        <label htmlFor="groupBy" className="text-sm font-medium">Group by:</label>
        <Select value={groupBy} onValueChange={(value: 'theme' | 'category' | 'progress') => setGroupBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="theme">Theme</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grouped Tables */}
      <div className="space-y-6">
        {groupedItems.map(({ groupName, items: groupItems, counts }) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle className="text-lg">{groupName}</CardTitle>
              <CardDescription>
                {counts.total} initiatives • 
                Conceptual: {counts.conceptual} • 
                Implementation: {counts.implementation} • 
                Planning: {counts.planning}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Theme</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {editingId === item.id ? (
                            <Input
                              value={editForm.task || ""}
                              onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            item.task
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {editingId === item.id ? (
                            <Input
                              value={editForm.theme || ""}
                              onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            item.theme
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <Select
                              value={editForm.category}
                              onValueChange={(value: GTDItem['category']) => 
                                setEditForm({ ...editForm, category: value })
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="conceptual">Conceptual</SelectItem>
                                <SelectItem value="implementation">Implementation</SelectItem>
                                <SelectItem value="planning">Planning</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline" className={getCategoryColor(item.category)}>
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <Select
                              value={editForm.progress}
                              onValueChange={(value: GTDItem['progress']) => 
                                setEditForm({ ...editForm, progress: value })
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not started">Not Started</SelectItem>
                                <SelectItem value="on track">On Track</SelectItem>
                                <SelectItem value="delayed">Delayed</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select value={item.progress} onValueChange={(value: GTDItem['progress']) => onUpdateProgress(item.id, value)}>
                              <SelectTrigger className="h-8">
                                <SelectValue asChild>
                                  <Badge variant="secondary" className={getProgressColor(item.progress)}>
                                    {item.progress.charAt(0).toUpperCase() + item.progress.slice(1)}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not started">Not Started</SelectItem>
                                <SelectItem value="on track">On Track</SelectItem>
                                <SelectItem value="delayed">Delayed</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {editingId === item.id ? (
                            <Input
                              value={editForm.approval || ""}
                              onChange={(e) => setEditForm({ ...editForm, approval: e.target.value as GTDItem['approval'] })}
                              className="h-8"
                            />
                          ) : (
                            item.approval
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {editingId === item.id ? (
                            <Input
                              value={editForm.assignee || ""}
                              onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            item.assignee
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={saveEditing}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEditing}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startEditing(item)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 