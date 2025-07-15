"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { AdminData } from "./types";
import { api } from "@/app/service/server";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  admin: AdminData;
}

export function EditProfileModal({
  open,
  onClose,
  admin,
}: EditProfileModalProps) {
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(admin.name);
    setEmail(admin.email);
    setPassword("");
  }, [admin]);

  const handleSave = async () => {
    try {
      const token = Cookies.get("JWT");

      if (!token) {
        console.error("Token JWT não encontrado.");
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        return;
      }

      const payload: { name: string; email: string; password?: string } = {
        name,
        email,
      };
      if (password) {
        payload.password = password;
      }

      await api.patch(`admin`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Informações atualizadas com sucesso!");
      onClose();
      window.location.reload();

    } catch (error) {
      console.error("Erro na requisição:", error);
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data?.message || 'Erro desconhecido ao atualizar.';
        alert("Erro ao atualizar: " + errorMessage);
      } else {
        alert("Erro inesperado ao atualizar.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Informações Pessoais</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}