'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Departament } from '@/app/types/user';

const formSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6).max(32),
  role: z.enum(['ADMIN']),
  departmentId: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function FormAddUsuario({ departamentos }: { departamentos: Departament[] }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
      departmentId: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find((c) => c.startsWith('JWT='))
        ?.split('=')[1];
      if (!token) {
        alert('Token de autenticação não encontrado');
        return;
      }

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.departmentId && { departmentId: Number(values.departmentId) }),
      };

      const res = await fetch('https://infra-timon-on.onrender.com/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? 'Erro ao criar usuário');
      }

      alert('Usuário criado com sucesso!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar. Veja o console.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card className="bg-[#291F75] text-white rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Criar Usuário</CardTitle>
              <CardDescription className="text-purple-200">
                Adicione um novo usuário ao sistema
              </CardDescription>
            </div>
            <Link href="/private/users">
              <ArrowLeft className="w-6 h-6 hover:text-purple-300 transition-colors" />
            </Link>
          </CardHeader>
        </Card>

        <Card className="rounded-lg shadow">
          <CardContent className="py-8 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departamentos.map((d) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="container mx-auto px-4 max-w-lg">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Criar Usuário'}
          </Button>
        </div>
      </div>
    </div>
  );
}
