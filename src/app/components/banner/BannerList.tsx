"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Banner } from "@/app/types/banner";
import { createBanner, deleteBanner } from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bannerSchema = z.object({
  linkTo: z.string().url({ message: "Por favor, insira uma URL válida." }),
  banner: z.any().refine((files) => files?.length == 1, "A imagem do banner é obrigatória."),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export function BannerList({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = React.useState<Banner[]>(initialBanners);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
  });

  const handleCreateBanner = async (values: BannerFormValues) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("linkTo", values.linkTo);
    formData.append("banner", values.banner[0]);

    const result = await createBanner(formData);

    if (result.success) {
      setIsAddDialogOpen(false);
      form.reset();
      window.location.reload();
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const handleDeleteBanner = async (id: string) => {
    const result = await deleteBanner(id);
    if (result.success) {
      setBanners(banners.filter((b) => b.id !== id));
    } else {
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Gerenciamento de Bandeiras
          </h1>
          <p className="text-sm text-primary-foreground/80">
            Adicione ou remova as Bandeiras do aplicativo móvel.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" /> Nova Bandeira
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Bandeira</DialogTitle>
              <DialogDescription>
                Faça o upload da imagem e insira o link de destino.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateBanner)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="linkTo">Link de Destino</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="linkTo" placeholder="https://exemplo.com" {...form.register("linkTo")} className="pl-10"/>
                  </div>
                  {form.formState.errors.linkTo && <p className="text-red-500 text-sm">{String(form.formState.errors.linkTo.message)}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner">Imagem da Bandeira</Label>
                   <div className="relative">
                     <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="banner" type="file" accept=".png,.jpg,.jpeg" {...form.register("banner")} className="pl-10"/>
                  </div>
                  {form.formState.errors.banner && <p className="text-red-500 text-sm">{String(form.formState.errors.banner.message)}</p>}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" variant="secondary" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Banner"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <Card key={banner.id}>
              <CardHeader>
                <CardTitle className="truncate text-base text-primary">{banner.linkTo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full rounded-md border bg-slate-50" style={{ paddingTop: '56.25%' }}>
                  <Image
                    src={banner.imageUrl}
                    alt="Banner"
                    layout="fill"
                    objectFit="contain"
                    className="p-2"
                  />
                </div>
              </CardContent>
              <CardFooter className="pb-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá deletar
                        permanentemente a bandeira.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBanner(banner.id)}
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-16">
            <p>Nenhuma bandeira cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}