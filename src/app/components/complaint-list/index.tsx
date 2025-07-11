"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, Filter, Calendar as CalendarIcon, Download, Trash2, Eye } from "lucide-react" 
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
import { getComplaints, getCategories } from "./action"
import { DateRange } from "react-day-picker"

const dateBetweenFilterFn: FilterFn<any> = (row, columnId, value) => {
    const date = new Date(row.getValue(columnId));
    const [start, end] = value as (Date | undefined)[];
    if (!start && !end) return true;
    if (!isValid(date)) return false;
    if (start && !end) return isAfter(date, start);
    if (!start && end) return isBefore(date, end);
    if (start && end) return isAfter(date, start) && isBefore(date, end);
    return true;
};

export function ComplaintsList() {
  const router = useRouter();
  const [complaints, setComplaints] = React.useState<Complaint[]>([])
  const [categories, setCategories] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true);
  
  const [searchInput, setSearchInput] = React.useState("");

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<Complaint>[] = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'title', header: 'Título' },
      { accessorKey: 'category', header: 'Categoria' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const getVariant = (s: string) => {
              if (s === 'Pendente') return 'destructive';
              if (s === 'Em Andamento') return 'default';
              if (s === 'Resolvido') return 'secondary';
              return 'outline';
          };
          return <Badge variant={getVariant(status)}>{status}</Badge>
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
        header: 'Ações',
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/complaints/${row.original.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log('Excluir:', row.original.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      }
  ];

  React.useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      const [complaintsData, categoriesData] = await Promise.all([
        getComplaints(),
        getCategories(),
      ]);
      setComplaints(complaintsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadInitialData();
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título ou ID..."
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

            <Select value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"} onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}>
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

            <Select value={(table.getColumn("category")?.getFilterValue() as string) ?? "all"} onValueChange={(value) => table.getColumn("category")?.setFilterValue(value === "all" ? "" : value)}>
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
                  className={cn("justify-start text-left font-normal w-full", !dateRange?.from && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>{format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}</>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
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
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-start mt-4">
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" onClick={clearFilters} className="ml-2">
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
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
                           className="cursor-pointer"
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
                          <TableCell colSpan={columns.length} className="text-center py-8 text-slate-500">
                             Nenhuma reclamação encontrada com os filtros aplicados.
                          </TableCell>
                       </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredRowModel().rows.length} linha(s) encontrada(s).
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