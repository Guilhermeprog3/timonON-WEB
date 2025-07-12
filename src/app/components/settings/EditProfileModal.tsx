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
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("JWT="))
        ?.split("=")[1];

      if (!token) {
        console.error("Token JWT não encontrado.");
        return;
      }

      const payload: { name: string; email: string; password?: string } = {
        name,
        email,
      };

      if (password) {
        payload.password = password;
      }

      const res = await fetch(`https://infra-timon-on.onrender.com/admin/${admin.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Erro ao atualizar: " + (error.message || 'Erro desconhecido'));
        return;
      }

      alert("Informações atualizadas com sucesso!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro inesperado ao atualizar.");
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

          <div>
            <label className="text-sm text-slate-600">Senha Atual</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha atual para alterar"
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