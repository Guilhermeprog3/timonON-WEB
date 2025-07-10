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
import { Pencil, Trash2, Plus, Check, Search, Filter, X } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function UserTable({
  data,
}: {
  data: { users: Admin[]; departamentos: Departament[] };
}) {
  const { users = [], departamentos = [] } = data || {};

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editValues, setEditValues] = React.useState({
    name: '',
    email: '',
    departmentId: null as number | null,
    password: '',
  });

  const getDepartamentoName = (id: number | null) =>
    departamentos.find((d) => d.id === id)?.name || 'N/A';

  const handleDelete = async (id: number) => {
    const token = document.cookie.split('; ').find(c => c.startsWith('JWT='))?.split('=')[1];
    if (!token) return alert('Token não encontrado');
    if (!confirm('Tem certeza que deseja deletar este administrador?')) return;

    try {
      const res = await fetch(`https://infra-timon-on.onrender.com/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('Administrador deletado!');
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.message || 'Erro ao deletar');
      }
    } catch (e) {
      alert('Erro de rede ao deletar');
    }
  };

  const handleSave = async (id: number) => {
    const token = document.cookie.split('; ').find(c => c.startsWith('JWT='))?.split('=')[1];
    if (!token) return alert('Token não encontrado');

    const payload: { [key: string]: any } = {
      name: editValues.name,
      email: editValues.email,
      role: 'ADMIN',
      departmentId: editValues.departmentId,
    };
    if (editValues.password.trim()) {
      payload.password = editValues.password.trim();
    }

    try {
      const res = await fetch(`https://infra-timon-on.onrender.com/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error((await res.json()).message || 'Erro ao atualizar');
      }
      alert('Administrador atualizado!');
      window.location.reload();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setEditingId(null);
    }
  };

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            value={editValues.name}
            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
            className="w-full"
          />
        ) : (
          <div className="font-medium">{row.getValue('name')}</div>
        ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            value={editValues.email}
            onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
            className="w-full"
          />
        ) : (
          <div>{row.getValue('email')}</div>
        ),
    },
    {
      accessorKey: 'departmentId',
      header: 'Departamento',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Select
            value={String(editValues.departmentId ?? '')}
            onValueChange={(value) => setEditValues({ ...editValues, departmentId: value ? Number(value) : null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              {departamentos.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div>{getDepartamentoName(row.original.departmentId)}</div>
        ),
      filterFn: (row, id, value) => String(row.getValue(id)) === String(value),
    },
    {
      id: 'password',
      header: 'Senha',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            type="password"
            placeholder="Nova senha (opcional)"
            value={editValues.password}
            onChange={(e) => setEditValues({ ...editValues, password: e.target.value })}
            className="w-full"
          />
        ) : (
          <span className="text-gray-400">••••••</span>
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
            return null; // Não permite editar ou excluir SUPERADMIN
        }

        const isEditing = editingId === row.original.id;

        return (
          <div className="flex items-center justify-end gap-1">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => handleSave(row.original.id)}>
                  <Check size={16} className="text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                  <X size={16} className="text-gray-600" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingId(row.original.id);
                  setEditValues({
                    name: row.original.name,
                    email: row.original.email,
                    departmentId: row.original.departmentId,
                    password: '',
                  });
                }}
              >
                <Pencil size={16} className="text-indigo-600" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
              <Trash2 size={16} className="text-red-600" />
            </Button>
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
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Gerenciamento de Usuários</h1>
        <p className="text-sm text-slate-600">Adicione, edite ou remova usuários administradores do sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-4'>
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
              <Button className="w-full flex items-center gap-2">
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