"use client"

import { useState, useEffect, useTransition } from "react"
import { Search, Filter, Calendar, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Complaint, ComplaintFilters } from "@/app/types/complaint"
import { getComplaints, getComplaintsByFilters, getCategories } from "./action"
import { DateRange } from "react-day-picker"

interface ComplaintsListProps {
  initialComplaints: Complaint[]
}

export function ComplaintsList({ initialComplaints }: ComplaintsListProps) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [categories, setCategories] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState<Omit<ComplaintFilters, 'neighborhood'>>({
    search: "",
    status: "all",
    category: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  })

  useEffect(() => {
    async function loadFilterOptions() {
      const categoriesData = await getCategories();
      setCategories(categoriesData)
    }
    loadFilterOptions()
  }, [])

  const handleFilterChange = (key: keyof typeof filters, value: string | DateRange | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    startTransition(async () => {
      const filteredComplaints = await getComplaintsByFilters(newFilters)
      setComplaints(filteredComplaints)
    })
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      status: "all",
      category: "all",
      dateRange: { from: undefined, to: undefined },
    }
    setFilters(clearedFilters)

    startTransition(async () => {
      const allComplaints = await getComplaints()
      setComplaints(allComplaints)
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pendente":
        return "destructive"
      case "Em Andamento":
        return "default"
      case "Resolvido":
        return "secondary"
      default:
        return "outline"
    }
  }

  const exportComplaints = () => {
    console.log("Exportando reclamações...")
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border">
        <div className="text-sm text-slate-600 mb-2">ÁREA DO USUÁRIO</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Reclamações</h1>
        <p className="text-slate-600">Gerencie todas as reclamações registradas pelos cidadãos.</p>
      </div>

      <Card className="py-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Grid ajustado */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título ou ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !filters.dateRange.from && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    "Selecione um período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={filters.dateRange}
                  onSelect={(range) => handleFilterChange("dateRange", range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-start mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="py-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Reclamações</CardTitle>
            <Button onClick={exportComplaints} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium text-blue-600">{complaint.id}</TableCell>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(complaint.status)}>{complaint.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(complaint.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {complaints.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Nenhuma reclamação encontrada com os filtros aplicados.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}