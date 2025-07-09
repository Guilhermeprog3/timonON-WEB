import { DepartamentTable } from "@/app/components/departament/DepartamentTable"
import { getDepartaments } from "@/app/components/departament/action"

export default async function DepartmentsPage() {
  const departments = await getDepartaments()

  return (
    <div className="space-y-6">
      <DepartamentTable initialDepartments={departments} />
    </div>
  )
}