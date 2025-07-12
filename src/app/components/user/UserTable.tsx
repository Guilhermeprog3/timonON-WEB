'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Search, UserX } from 'lucide-react';
import { Admin, Departament } from '@/app/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { deactivateUser } from './action';

export function UserTable({
  data,
}: {
  data: { users: Admin[]; departamentos: Departament[] };
}) {
  const { users = [], departamentos = [] } = data || {};

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const getDepartamentoName = (id: number | null) =>
    departamentos.find((d) => d.id === id)?.name || 'N/A';

  const handleDeactivate = async (id: number) => {
    if (!confirm('Tem certeza que deseja inativar este administrador?')) return;
    const result = await deactivateUser(id);
    alert(result.message);
    if (result.success) {
      window.location.reload();
    }
  };

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'departmentId',
      header: 'Departamento',
      cell: ({ row }) => (
        <div>{getDepartamentoName(row.original.departmentId)}</div>
      ),
      filterFn: (row, id, value) => String(row.getValue(id)) === String(value),
    },
     {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status.toUpperCase() === 'ATIVO' ? 'success' : 'destructive'}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Permissão',
      cell: ({ row }) => <Badge variant={row.original.role === 'SUPERADMIN' ? 'default' : 'secondary'}>{row.getValue('role')}</Badge>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        if (row.original.role === 'SUPERADMIN') {
            return null;
        }

        return (
          <div className="flex items-center justify-end gap-1">
            {row.original.status.toUpperCase() === 'ATIVO' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeactivate(row.original.id)}
                title="Inativar Usuário"
              >
                <UserX size={16} className="text-orange-600" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-1">Gerenciamento de Usuários</h1>
        <p className="text-sm text-primary-foreground/80">Adicione ou remova usuários administradores do sistema.</p>
      </div>

      <Card>
        <CardContent className='p-4'>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select
              value={(table.getColumn('departmentId')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) => table.getColumn('departmentId')?.setFilterValue(value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {departamentos.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/users/new" className="w-full md:w-auto flex-shrink-0">
              <Button variant="secondary" className="w-full flex items-center gap-2">
                <Plus size={16} />
                Novo Usuário
              </Button>
            </Link>
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
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="flex items-center justify-end space-x-2 p-6 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} de {users.length} usuário(s).
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
  );
}