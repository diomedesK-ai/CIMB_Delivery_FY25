"use client"

import type * as React from "react"

const ChartContainer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const Chart = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const ChartLegend = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const ChartTooltip = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const ChartTooltipContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const ChartPie = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const ChartBar = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

const ChartLine = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

export { ChartContainer, Chart, ChartLegend, ChartTooltip, ChartTooltipContent, ChartPie, ChartBar, ChartLine }
