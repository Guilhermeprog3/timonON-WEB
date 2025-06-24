'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Pencil, Trash2, Plus, Check } from 'lucide-react';
import { Admin, Departament } from '@/app/types/user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export function UserTable({
  data,
}: {
  data: { users: Admin[]; departamentos: Departament[] };
}) {

  const { users = [], departamentos = [] } = data || {};
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    name: string;
    email: string;
    departmentId: number | null;
    password: string;
  }>({ name: '', email: '', departmentId: null, password: '' });


  const getDepartamento = (id: number | null) =>
    departamentos.find((d) => d.id === id)?.name || '-';


  async function handleDelete(id: number) {
    const token = document.cookie.split('; ').find(c => c.startsWith('JWT='))?.split('=')[1];
    if (!token) return alert('Token não encontrado');

    if (!confirm('Tem certeza que deseja deletar este administrador?')) return;

    try {
      const res = await fetch(`https://infra-timon-on.onrender.com/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        alert('Administrador deletado!');
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.message || 'Erro ao deletar');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de rede ao deletar');
    }
  }


  async function handleSave(id: number) {
    const token = document.cookie.split('; ').find(c => c.startsWith('JWT='))?.split('=')[1];
    if (!token) return alert('Token não encontrado');


    const payload: Record<string, unknown> = {
      name: editValues.name,
      email: editValues.email,
      role: 'ADMIN',
    };
    if (editValues.departmentId) payload.departmentId = editValues.departmentId;
    if (editValues.password.trim()) payload.password = editValues.password;

    try {
      const res = await fetch('https://infra-timon-on.onrender.com/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao atualizar');
      }
      alert('Administrador atualizado!');
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
    } finally {
      setEditingId(null);
    }
  }


  const columns: ColumnDef<Admin>[] = [

    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <input
            className="border rounded px-2 py-1 text-sm w-full"
            value={editValues.name}
            onChange={(e) =>
              setEditValues({ ...editValues, name: e.target.value })
            }
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
          <input
            className="border rounded px-2 py-1 text-sm w-full"
            value={editValues.email}
            onChange={(e) =>
              setEditValues({ ...editValues, email: e.target.value })
            }
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
          <select
            className="border rounded px-2 py-1 text-sm w-full"
            value={editValues.departmentId ?? ''}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                departmentId: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">— Selecione —</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        ) : (
          <div>{getDepartamento(row.original.departmentId)}</div>
        ),
    },

    {
      accessorKey: 'role',
      header: 'Permissão',
      cell: ({ row }) => (
        <span className="inline-block rounded-full bg-blue-100 text-blue-800 text-xs px-3 py-1 uppercase">
          {row.getValue('role')}
        </span>
      ),
    },
 
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => {
        const value = row.getValue('createdAt') as string;
        return value ? new Date(value).toLocaleDateString('pt-BR') : '-';
      },
    },

    {
      id: 'password',
      header: 'Senha',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <input
            type="password"
            placeholder="Nova senha (opcional)"
            className="border rounded px-2 py-1 text-sm w-full"
            value={editValues.password}
            onChange={(e) =>
              setEditValues({ ...editValues, password: e.target.value })
            }
          />
        ) : (
          <span className="text-gray-400">••••••</span>
        ),
    },

    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSave(row.original.id)}
              >
                <Check size={16} className="text-green-600" />
              </Button>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Administradores</h2>
          <p className="text-sm text-gray-600">
            Gerencie os usuários do sistema e suas permissões.
          </p>
        </div>
        <Link href="/users/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Novo Usuário
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
