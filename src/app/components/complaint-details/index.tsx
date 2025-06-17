"use client"

import * as React from "react";
import { ArrowLeft, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplaintDetailsData, Sector } from "@/app/types/complaint";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const ComplaintMap = dynamic(() => import('./map'), { ssr: false });

type ComplaintDetailsProps = {
    complaint: ComplaintDetailsData;
};

type Status = "Pendente" | "Em Andamento" | "Resolvido";

export function ComplaintDetails({ complaint }: ComplaintDetailsProps) {
    const router = useRouter();
    
    const [updateStatus, setUpdateStatus] = React.useState<Status>(complaint.status);
    const [updateComment, setUpdateComment] = React.useState("");


    const getStatusVariant = (status: string): "destructive" | "default" | "secondary" | "outline" => {
        if (status === 'Pendente') return 'destructive';
        if (status === 'Em Andamento') return 'default';
        if (status === 'Resolvido') return 'secondary';
        return 'outline';
    };

    const handleUpdateSubmit = () => {
        console.log({
            status: updateStatus,
            comment: updateComment
        });
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-slate-600 mb-2">ÁREA DO USUÁRIO / RECLAMAÇÕES / DETALHES</p>
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{complaint.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                            <Badge variant="outline">{complaint.category}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes da Reclamação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Descrição</h3>
                                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">Data de Registro</h3>
                                    <p className="text-sm text-muted-foreground">{new Date(complaint.creation_date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">Endereço</h3>
                                    <p className="text-sm text-muted-foreground">{complaint.address}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Foto</h3>
                                {complaint.photo_url ? (
                                    <img src={complaint.photo_url} alt="Foto da reclamação" className="rounded-lg border max-w-sm mt-2" />
                                ) : (
                                    <div className="text-muted-foreground border rounded-lg p-10 text-center mt-2">Nenhuma foto enviada.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Localização</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {complaint.latitude && complaint.longitude ? (
                                <ComplaintMap lat={complaint.latitude} lng={complaint.longitude} />
                             ) : (
                                <div className="text-muted-foreground text-center p-10 border rounded-lg">
                                    Localização não fornecida.
                                </div>
                             )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Atualizar Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={updateStatus} onValueChange={(value) => setUpdateStatus(value as Status)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pendente">Pendente</SelectItem>
                                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                            <SelectItem value="Resolvido">Resolvido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Comentário</label>
                                <Textarea 
                                  placeholder="Adicione um comentário sobre a atualização..." 
                                  value={updateComment}
                                  onChange={(e) => setUpdateComment(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleUpdateSubmit}>Atualizar</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados do Cidadão</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p><strong>Nome:</strong> {complaint.citizen.name}</p>
                            <p><strong>Email:</strong> {complaint.citizen.email}</p>
                            <p><strong>CPF:</strong> {complaint.citizen.cpf}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Atualizações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {complaint.updates.length > 0 ? complaint.updates.map((update, index) => (
                               <div key={update.id} className={`text-sm ${index > 0 ? 'border-t pt-4' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="font-semibold">{update.userName}</span>
                                       <span className="text-xs text-muted-foreground">{new Date(update.timestamp).toLocaleString('pt-BR')}</span>
                                    </div>
                                    <Badge variant={getStatusVariant(update.status)} className="my-1">{update.status}</Badge>
                                    <p className="text-muted-foreground bg-slate-50 p-2 rounded-md mt-2">{update.comment || "Nenhum comentário."}</p>
                               </div>
                            )) : (
                                <p className="text-sm text-muted-foreground p-4 text-center">Nenhuma atualização registrada.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}