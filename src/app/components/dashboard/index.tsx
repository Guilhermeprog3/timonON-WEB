"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock, CheckCircle, AlertTriangle, TrendingUp, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
      address: string;
      createdAt: string;
    }[];
    mostReported: {
      id: string;
      title: string;
      complaints: number;
      address: string;
    }[];
  };
}

export function Dashboard({ data }: DashboardProps) {
  const router = useRouter(); 

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

  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-1">Geral</h1>
        <p className="text-sm text-primary-foreground/80">Visão geral das reclamações e demandas dos cidadãos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total de Reclamações" value={data.total} icon={<MessageCircle />} />
        <StatCard label="Pendentes" value={data.pendentes} icon={<AlertTriangle className="text-destructive"/>} />
        <StatCard label="Em Andamento" value={data.andamento} icon={<Clock className="text-yellow-500"/>} />
        <StatCard label="Resolvidas" value={data.resolvidas} icon={<CheckCircle className="text-green-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="pt-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-primary">Reclamações Recentes</CardTitle>
                  <p className="text-sm text-muted-foreground">As últimas reclamações registradas no sistema.</p>
                </div>
                <Button variant="link" className="text-secondary" onClick={() => router.push('/complaint')}>
                  Ver Todas
                  <ExternalLink className="h-4 w-4 ml-2"/>
                </Button>
            </CardHeader>

            <CardContent className="space-y-1 px-4 pb-4">
                {data.recentes.map((rec) => (
                  <div 
                    key={rec.id} 
                    className="border-b last:border-b-0 py-3 px-2 flex justify-between items-start cursor-pointer hover:bg-accent rounded-md transition-colors"
                    onClick={() => router.push(`/complaintDetails/${rec.id}`)}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-2 mb-1">
                          {rec.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                          ID: {rec.id} • {rec.address}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(rec.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                ))}

                {data.recentes.length === 0 && (
                  <div className="text-muted-foreground text-sm p-5 text-center">Nenhuma reclamação recente encontrada.</div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg text-primary font-semibold flex items-center gap-2">
                    <TrendingUp />
                    Mais Denunciadas
                </CardTitle>
                <p className="text-sm text-muted-foreground">Reclamações com mais denúncias.</p>
            </CardHeader>
            <CardContent className="space-y-1 px-4 pb-4">
                {data.mostReported.map((rec) => (
                    <div 
                      key={rec.id} 
                      className="border-b last:border-b-0 py-3 px-2 flex justify-between items-start cursor-pointer hover:bg-accent rounded-md transition-colors"
                      onClick={() => router.push(`/complaintDetails/${rec.id}`)}
                    >
                        <div>
                          <div className="font-semibold mb-1">
                              {rec.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                              Endereço: {rec.address}
                          </div>
                        </div>
                        <div className="text-sm text-destructive mt-1 whitespace-nowrap font-bold">
                            {rec.complaints} {rec.complaints === 1 ? 'denúncia' : 'denúncias'}
                        </div>
                    </div>
                ))}
                 {data.mostReported.length === 0 && (
                    <div className="text-muted-foreground text-sm p-5 text-center">Nenhuma reclamação com múltiplas denúncias.</div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold text-primary">{value}</div>
      </CardContent>
    </Card>
  );
}