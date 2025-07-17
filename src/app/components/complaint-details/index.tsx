"use client"

import * as React from "react";
import { ArrowLeft, Trash2, MapPin, Building, Calendar, User, MessageSquare, ThumbsUp, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplaintDetailsData, ComplaintUpdate, Comment } from "@/app/types/complaint";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { markAsInProgress, markAsResolved, deleteComplaint, createComment, likeComment, deleteUserComment } from "./action";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSession } from "next-auth/react";


const ComplaintMap = dynamic(() => import('./map'), { ssr: false });

const commentSchema = z.object({
  text: z.string().min(3, { message: "O comentário deve ter no mínimo 3 caracteres." }),
});

type ComplaintDetailsProps = {
    complaint: ComplaintDetailsData;
};

type Status = "Pendente" | "Em Andamento" | "Resolvido";

export function ComplaintDetails({ complaint: initialComplaint }: ComplaintDetailsProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [complaint, setComplaint] = React.useState(initialComplaint);
    const [updateStatus, setUpdateStatus] = React.useState<Status>(complaint.status);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
    const [likingComment, setLikingComment] = React.useState<number | null>(null);

    const form = useForm<z.infer<typeof commentSchema>>({
      resolver: zodResolver(commentSchema),
      defaultValues: {
        text: "",
      },
    });

    const displayUpdates = React.useMemo(() => {
        const allEvents: ComplaintUpdate[] = [];

        allEvents.push({
            id: 'creation-event',
            timestamp: complaint.creation_date,
            status: 'Pendente',
            comment: 'Reclamação registrada pelo cidadão.',
            userName: complaint.citizen.name,
        });

        if (complaint.status !== 'Pendente' || complaint.comment) {
             allEvents.push({
                id: 'latest-update-event',
                timestamp: complaint.updatedAt,
                status: complaint.status,
                comment: complaint.comment || `Status alterado para "${complaint.status}"`,
                userName: 'Administração',
            });
        }
        
        return allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [complaint]);

    const getStatusVariant = (status: string): VariantProps<typeof badgeVariants>["variant"] => {
        if (status === 'Pendente') return 'destructive';
        if (status === 'Em Andamento') return 'warning';
        if (status === 'Resolvido') return 'success';
        return 'outline';
    };

    const handleUpdateSubmit = async () => {
        if (updateStatus === complaint.status) {
            alert("Para atualizar, você deve selecionar um novo status.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            if (updateStatus === 'Em Andamento') {
                await markAsInProgress(complaint.id, "");
            } else if (updateStatus === 'Resolvido') {
                await markAsResolved(complaint.id, "");
            }
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Falha ao atualizar status:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async () => {
        const result = await deleteComplaint(complaint.id);
        
        if (result.success) {
            router.push('/complaint');
        } else {
        }
    };
    
    const handleCommentSubmit = async (values: z.infer<typeof commentSchema>) => {
      setIsSubmittingComment(true);
      const result = await createComment(complaint.id, values.text);
      if (result.success && result.comment) {
        setComplaint(prevComplaint => ({
            ...prevComplaint,
            comments: [...prevComplaint.comments, result.comment as Comment]
        }));
        form.reset();
      } else {
        alert(`Erro: ${result.message}`);
      }
      setIsSubmittingComment(false);
    };

    const handleLike = async (commentId: number) => {
        setLikingComment(commentId);
      
        const originalComments = complaint.comments;
      
        setComplaint(prevComplaint => ({
          ...prevComplaint,
          comments: prevComplaint.comments.map(c => {
            if (c.id === commentId) {
              const currentLikes = Number(c.totalLikes) || 0;
              return { 
                ...c, 
                likedByUser: !c.likedByUser,
                totalLikes: c.likedByUser ? currentLikes - 1 : currentLikes + 1 
              };
            }
            return c;
          })
        }));
        
        const result = await likeComment(complaint.id, commentId);
        
        if (!result.success) {
          setComplaint(prevComplaint => ({
              ...prevComplaint,
              comments: originalComments
          }));
          alert(result.message);
        } else {
          router.refresh();
        }
        
        setLikingComment(null);
      }
    
    const isResolved = complaint.status === 'Resolvido';

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{complaint.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                            <Badge variant="outline">{complaint.category}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1"><Building className="h-3 w-3" /> {complaint.department}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso excluirá permanentemente a reclamação.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes da Reclamação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Descrição</h3>
                                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1"><Calendar className="h-4 w-4" /> Data de Registro</h3>
                                    <p className="text-sm text-muted-foreground">{new Date(complaint.creation_date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                 <div>
                                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1"><Calendar className="h-4 w-4" /> Última Atualização</h3>
                                    <p className="text-sm text-muted-foreground">{new Date(complaint.updatedAt).toLocaleDateString('pt-BR')}</p>
                                 </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1"><MapPin className="h-4 w-4" /> Endereço</h3>
                                    <p className="text-sm text-muted-foreground">{complaint.address}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Foto</h3>
                                <div className="mt-2 flex justify-center items-center border rounded-lg p-4 h-64 bg-gray-50">
                                  {complaint.photo_url ? (
                                      <Image
                                        src={complaint.photo_url} 
                                        alt="Foto da reclamação" 
                                        width={500}
                                        height={500}
                                        className="rounded-lg max-h-full max-w-full object-contain" 
                                      />
                                  ) : (
                                      <div className="text-muted-foreground text-center">Nenhuma foto enviada.</div>
                                  )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Localização</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                             {complaint.latitude && complaint.longitude ? (
                                <ComplaintMap lat={complaint.latitude} lng={complaint.longitude} />
                             ) : (
                                <div className="text-muted-foreground text-center p-10 border rounded-lg bg-gray-50">
                                    Localização não fornecida.
                                </div>
                             )}
                        </CardContent>
                    </Card>

                    <Card className="border-secondary border-2">
                        <CardHeader>
                            <CardTitle className="text-secondary">Atualizar Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                           <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select 
                                    value={updateStatus} 
                                    onValueChange={(value) => setUpdateStatus(value as Status)}
                                    disabled={isResolved}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {complaint.status === 'Pendente' && (
                                            <>
                                                <SelectItem value="Pendente">Pendente</SelectItem>
                                                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                            </>
                                        )}
                                        {complaint.status === 'Em Andamento' && (
                                            <>
                                                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                                <SelectItem value="Resolvido">Resolvido</SelectItem>
                                            </>
                                        )}
                                        {isResolved && (
                                            <SelectItem value="Resolvido">Resolvido</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleUpdateSubmit} disabled={isSubmitting || isResolved} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
                            </Button>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Comentários</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            {complaint.comments && complaint.comments.length > 0 ? complaint.comments.map((comment) => (
                               <div key={comment.id} className="flex gap-3">
                                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                                        {comment.user?.avatarUrl ? (
                                            <Image 
                                                src={comment.user.avatarUrl} 
                                                alt={comment.user.name || 'Avatar'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserCircle className="h-10 w-10 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-sm">{comment.user?.name || 'Usuário'}</span>
                                            {session?.user?.id === String(comment.user?.id) &&
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta ação não pode ser desfeita. Isso irá deletar permanentemente o seu comentário.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={async () => {
                                                            const result = await deleteUserComment(comment.id);
                                                            if (result.success) {
                                                                setComplaint(prev => ({
                                                                    ...prev,
                                                                    comments: prev.comments.filter(c => c.id !== comment.id)
                                                                }))
                                                            } else {
                                                                alert(result.message)
                                                            }
                                                        }}>Deletar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            }
                                        </div>
                                        <p className="text-muted-foreground bg-gray-50 p-2 rounded-md mt-1 text-sm">{comment.text}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleLike(comment.id)}
                                                disabled={likingComment === comment.id}
                                                className={`flex items-center gap-1 h-auto px-2 py-1 text-xs ${comment.likedByUser ? 'text-primary' : 'text-muted-foreground'}`}
                                            >
                                               <ThumbsUp className={`h-4 w-4 ${comment.likedByUser ? 'fill-current' : ''}`} />
                                               <span>{comment.totalLikes}</span>
                                            </Button>
                                        </div>
                                   </div>
                               </div>
                            )) : (
                                <p className="text-sm text-muted-foreground p-4 text-center">Nenhum comentário nesta publicação.</p>
                            )}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Adicionar Comentário</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleCommentSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Seu comentário</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Escreva seu comentário aqui..."
                                                        disabled={isSubmittingComment}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isSubmittingComment}>
                                        {isSubmittingComment ? 'Enviando...' : 'Enviar Comentário'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Dados do Cidadão</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm p-6">
                            <p><strong>Nome:</strong> {complaint.citizen.name}</p>
                            <p><strong>Email:</strong> {complaint.citizen.email}</p>
                            <p><strong>CPF:</strong> {complaint.citizen.cpf}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Atualizações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            {displayUpdates.length > 0 ? displayUpdates.map((update, index) => (
                               <div key={update.id} className={`relative pl-6 ${index < displayUpdates.length - 1 ? 'pb-6 border-l-2 border-gray-200' : 'pb-0'}`}>
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary"></div>
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="font-semibold">{update.userName}</span>
                                       <span className="text-xs text-muted-foreground">{new Date(update.timestamp).toLocaleString('pt-BR')}</span>
                                    </div>
                                    <Badge variant={getStatusVariant(update.status)} className="my-1">{update.status}</Badge>
                                    <p className="text-muted-foreground bg-gray-50 p-2 rounded-md mt-2 text-xs">{update.comment || "Nenhum comentário."}</p>
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