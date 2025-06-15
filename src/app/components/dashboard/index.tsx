"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface DashboardProps {
  data: {
    total: number;
    pendentes: number;
    andamento: number;
    resolvidas: number;
    recentes: {
      id: string;
      title: string;
      status: "Pendente" | "Em Andamento" | "Resolvido";
      neighborhood: string;
      createdAt: string;
    }[];
  };
}

export function Dashboard({ data }: DashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-red-100 text-red-800";
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800";
      case "Resolvido":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-200 text-slate-800";
    }
  };

  return (
    <>
      <div className="bg-slate-50 p-4 rounded-lg border">
        <div className="text-sm text-slate-600 mb-2">ÁREA DO USUÁRIO</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-600">Visão geral das reclamações e demandas dos cidadãos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Reclamações" value={data.total} description="Todas as reclamações registradas" icon={<MessageCircle />} />
        <StatCard icon={<AlertTriangle />} label="Reclamações Pendentes" value={data.pendentes} description="Aguardando análise inicial" />
        <StatCard icon={<Clock />} label="Em Andamento" value={data.andamento} description="Em processo de resolução" />
        <StatCard icon={<CheckCircle />} label="Resolvidas" value={data.resolvidas} description="Reclamações finalizadas" />
      </div>

      <Card className="mt-6">
  <CardHeader className="pt-4 pb-2 flex flex-row items-start justify-between">
    <div>
      <CardTitle className="text-lg text-slate-900 font-semibold">Reclamações Recentes</CardTitle>
      <p className="text-sm text-slate-500">As últimas reclamações registradas no sistema.</p>
    </div>
    <a
      href="/complaint"
      className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1 mt-1"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6m2 0a2 2 0 012 2v0a2 2 0 01-2 2H9m0 0H7a2 2 0 01-2-2v0a2 2 0 012-2h2zm0 4v10m0 0h6m-6 0a2 2 0 01-2-2v0a2 2 0 012-2h6a2 2 0 012 2v0a2 2 0 01-2 2h-6z" />
      </svg>
      Ver Todas
    </a>
  </CardHeader>

  <CardContent className="space-y-4 px-6 pb-6">
    {data.recentes.map((rec) => (
      <div key={rec.id} className="border-b pb-2 flex justify-between items-start">
        <div>
          <div className="text-slate-900 font-semibold flex items-center gap-2">
            {rec.title}
            <Badge className={getStatusColor(rec.status)}>{rec.status}</Badge>
          </div>
          <div className="text-sm text-slate-600">
            ID: {rec.id} • Bairro: {rec.neighborhood}
          </div>
        </div>
        <div className="text-sm text-slate-500 mt-1 whitespace-nowrap">
          {new Date(rec.createdAt).toLocaleDateString("pt-BR")}
        </div>
      </div>
    ))}

    {data.recentes.length === 0 && (
      <div className="text-slate-500 text-sm pb-5">Nenhuma reclamação recente encontrada.</div>
    )}
  </CardContent>
</Card>

    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-3xl font-bold text-slate-900 pl-2">{value}</div>
        <div className="text-sm text-slate-500 pl-2">{description}</div>
      </CardContent>
    </Card>
  );
}
