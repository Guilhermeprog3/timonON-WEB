"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, Filter, Calendar as CalendarIcon, Download, Trash2, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isAfter, isBefore, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Complaint } from "@/app/types/complaint"
import { getCategories, deleteComplaint } from "./action" // Removido getComplaints daqui
import { DateRange } from "react-day-picker"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import * as XLSX from 'xlsx';

const dateBetweenFilterFn: FilterFn<Complaint> = (row: Row<Complaint>, columnId: string, value: [Date | undefined, Date | undefined]) => {
    const date = new Date(row.getValue(columnId));
    const [start, end] = value;
    if (!start && !end) return true;
    if (!isValid(date)) return false;
    if (start && !end) return isAfter(date, start);
    if (!start && end) return isBefore(date, end);
    if (start && end) return isAfter(date, start) && isBefore(date, end);
    return true;
};

interface ComplaintsListProps {
  initialComplaints: Complaint[];
}

export function ComplaintsList({ initialComplaints }: ComplaintsListProps) {
  const router = useRouter();
  const [complaints, setComplaints] = React.useState<Complaint[]>(initialComplaints)
  const [categories, setCategories] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false);
  
  const [searchInput, setSearchInput] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('');

  const handleDelete = async (id: string) => {
    const result = await deleteComplaint(id);
    if (result.success) {
      setComplaints((prevComplaints) => prevComplaints.filter((c) => c.id !== id));
    } else {
      alert(result.message);
    }
  };
  
  const getStatusVariant = (status: string): 'destructive' | 'warning' | 'success' | 'outline' => {
    switch (status) {
      case "Pendente":
        return "destructive";
      case "Em Andamento":
        return "warning";
      case "Resolvido":
        return "success";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<Complaint>[] = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'title', header: 'Título' },
      { accessorKey: 'category', header: 'Categoria' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return <Badge variant={getStatusVariant(status)}>{status}</Badge>
        }
      },
      {
        accessorKey: 'date',
        header: 'Data',
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString("pt-BR"),
        filterFn: dateBetweenFilterFn,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Ações</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/complaintDetails/${row.original.id}`);
              }}
            >
              <Eye className="h-4 w-4 text-primary" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a reclamação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      }
  ];

  React.useEffect(() => {
    async function loadCategories() {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    }
    loadCategories();
  }, []);

  const table = useReactTable({
    data: complaints,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  
  React.useEffect(() => {
      table.getColumn('date')?.setFilterValue([dateRange?.from, dateRange?.to]);
  }, [dateRange, table]);

  const handleSearch = () => {
    setGlobalFilter(searchInput);
  };

  const clearFilters = () => {
      table.resetColumnFilters();
      setGlobalFilter('');
      setSearchInput('');
      setDateRange(undefined); 
  }

  const exportComplaints = () => {
    const dataToExport = table.getFilteredRowModel().rows.map(row => ({
      ID: row.original.id,
      Título: row.original.title,
      Categoria: row.original.category,
      Status: row.original.status,
      Data: new Date(row.original.date).toLocaleDateString("pt-BR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reclamações");
    XLSX.writeFile(workbook, "reclamacoes.xlsx");
  }

  return (
    <div className="space-y-6">
       <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-1">Gerenciamento de Reclamações</h1>
        <p className="text-sm text-primary-foreground/80">Filtre, visualize e gerencie todas as reclamações registradas no sistema.</p>
      </div>

      <Card className="pb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título ou ID da reclamação..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch();
                      }
                  }}
                  className="pl-10"
                />
              </div>
               <Button onClick={handleSearch} variant="secondary" className="w-full md:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Aplicar Busca
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"} onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Resolvido">Resolvido</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={(table.getColumn("category")?.getFilterValue() as string) ?? "all"} onValueChange={(value) => table.getColumn("category")?.setFilterValue(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
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
                      className={cn("w-full justify-start text-left font-normal", !dateRange?.from && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>{format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}</>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        "Filtrar por data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                 <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                 </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-primary">Lista de Reclamações</CardTitle>
            <Button onClick={exportComplaints} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar para Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow 
                           key={row.id}
                           className="cursor-pointer hover:bg-accent"
                           onClick={() => router.push(`/complaintDetails/${row.original.id}`)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                       <TableRow>
                          <TableCell colSpan={columns.length} className="text-center h-24 text-muted-foreground">
                             Nenhuma reclamação encontrada com os filtros aplicados.
                          </TableCell>
                       </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  {table.getFilteredRowModel().rows.length} de {complaints.length} reclamações.
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}