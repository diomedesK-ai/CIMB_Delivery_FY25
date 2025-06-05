import { DependencyMatrix } from "@/components/dependency-matrix"

export default function DependencyMatrixPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dependency Matrix</h1>
        <p className="text-muted-foreground">Comprehensive view of dependencies required for each AI use case</p>
      </div>

      <DependencyMatrix />
    </div>
  )
}
