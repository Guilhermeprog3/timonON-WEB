"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Pencil, Trash2, Plus, Check, X } from "lucide-react"
import { Departament } from "@/app/types/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormEvent, useState } from "react"
import { createDepartment, updateDepartment, deleteDepartment } from "./action"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function DepartamentTable({ initialDepartments }: { initialDepartments: Departament[] }) {
  const [departments, setDepartments] = useState<Departament[]>(initialDepartments)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [newDepartmentName, setNewDepartmentName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleEdit = (department: Departament) => {
    setEditingId(department.id)
    setEditingName(department.name)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleSave = async (id: number) => {
    const result = await updateDepartment(id, editingName)
    if (result.success) {
      setDepartments(departments.map((d) => (d.id === id ? { ...d, name: editingName } : d)))
      handleCancel()
    } else {
      alert(result.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este departamento?")) {
      const result = await deleteDepartment(id)
      if (result.success) {
        setDepartments(departments.filter((d) => d.id !== id))
      } else {
        alert(result.message)
      }
    }
  }

  const handleAddDepartment = async (e: FormEvent) => {
    e.preventDefault()
    if (!newDepartmentName.trim()) {
      alert("O nome do departamento não pode estar vazio.")
      return
    }
    const result = await createDepartment(newDepartmentName)
    if (result.success) {
      window.location.reload()
      setIsAddDialogOpen(false)
      setNewDepartmentName("")
    } else {
      alert(result.message)
    }
  }

  const columns: ColumnDef<Departament>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
          />
        ) : (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => handleSave(row.original.id)}>
                  <Check size={16} className="text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <X size={16} className="text-red-600" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
                <Pencil size={16} className="text-indigo-600" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Departamentos</h2>
          <p className="text-sm text-gray-600">Adicione, edite ou remova departamentos do sistema.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Departamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Departamento</DialogTitle>
              <DialogDescription>
                Insira o nome do novo departamento. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDepartment}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Departamento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={departments} />
    </div>
  )
}