"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Pencil, Trash2, Plus, Check, X, Search } from "lucide-react"
import { Category } from "./action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { createCategory, updateCategory, deleteCategory } from "./action"

export function CategoryTable({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editingName, setEditingName] = React.useState("")
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  const handleEdit = React.useCallback((category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }, [])

  const handleCancel = React.useCallback(() => {
    setEditingId(null)
    setEditingName("")
  }, [])

  const handleSave = React.useCallback(async (id: number) => {
    if (!editingName.trim()) {
        alert("O nome da categoria não pode estar vazio.");
        return;
    }
    const result = await updateCategory(id, editingName);
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.message);
    }
  }, [editingName])

  const handleDelete = React.useCallback(async (id: number) => {
    const result = await deleteCategory(id)
    if (result.success) {
      setCategories(prev => prev.filter((d) => d.id !== id))
    } else {
      alert(result.message)
    }
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert("O nome da categoria não pode estar vazio.");
      return;
    }
    const result = await createCategory(newCategoryName);
    if (result.success) {
      setIsAddDialogOpen(false);
      setNewCategoryName("");
      window.location.reload();
    } else {
      alert(result.message);
    }
  }

  const columns = React.useMemo<ColumnDef<Category>[]>(() => [
    {
      accessorKey: "name",
      header: "Nome da Categoria",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
            autoFocus
          />
        ) : (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return (
          <div className="flex items-center justify-end gap-2">
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
                <Pencil size={16} className="text-primary" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(row.original.id)}>Deletar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ], [editingId, editingName, handleEdit, handleCancel, handleSave, handleDelete]);

  const table = useReactTable({
    data: categories,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
       <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-1">Gerenciamento de Categorias</h1>
        <p className="text-sm text-primary-foreground/80">Adicione, edite ou remova as categorias do sistema.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                placeholder="Buscar por nome da categoria..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-full"
                />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                <Plus size={16} />
                Nova Categoria
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                <DialogDescription>
                    Insira o nome da nova categoria. Clique em salvar quando terminar.
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCategory}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Nome
                    </Label>
                    <Input
                        id="name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="col-span-3"
                        required
                    />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" variant="secondary">Salvar Categoria</Button>
                </DialogFooter>
                </form>
            </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
             <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                        ))}
                    </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                        Nenhuma categoria encontrada.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
         <div className="flex items-center justify-end space-x-2 p-6 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} de {categories.length} categoria(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}