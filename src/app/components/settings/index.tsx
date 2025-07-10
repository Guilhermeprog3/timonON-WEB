"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminData } from "./types";
import { Mail, Lock, Pencil } from "lucide-react";
import { useState } from "react";
import { PasswordResetModal } from "./PasswordResetModal";
import { EditProfileModal } from "./EditProfileModal"; // <-- NOVO

interface SettingsProps {
  admin: AdminData;
}

export function Settings({ admin }: SettingsProps) {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false); // <-- NOVO

  return (
    <div className="space-y-6">
      {/* Cabeçalho*/}
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-600 text-sm">Gerencie suas preferências e configurações de conta</p>
      </div>

      {/* Card do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 mt-2">
            <Mail className="w-5 h-5" />
            {admin.name}
          </CardTitle>
          <p className="text-slate-500 text-sm">{admin.email}</p>
        </CardHeader>
        <CardContent className="flex gap-2 mb-2">
          <Badge variant="outline">{admin.role}</Badge>
          {admin.department ? (
            <Badge variant="outline">{admin.department.name}</Badge>
          ) : (
            <Badge variant="outline" className="opacity-60 italic">
              Sem departamento
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Card da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 mt-2">Conta</CardTitle>
          <p className="text-slate-500 text-sm">Gerencie suas informações pessoais e preferências</p>
        </CardHeader>
        <CardContent className="space-y-4 mb-2">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="text-sm text-slate-600">Informações Pessoais</p>
              <p className="text-slate-800 text-sm">Nome, email e dados de contato</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditProfileModalOpen(true)}>
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-600">Alterar Senha</p>
              <p className="text-slate-800 text-sm">Mantenha sua conta segura com uma senha forte</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPasswordModalOpen(true)}>
              <Lock className="w-4 h-4 mr-1" />
              Alterar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <PasswordResetModal
        open={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        email={admin.email}
      />

      <EditProfileModal
        open={isEditProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        admin={admin}
      />
    </div>
  );
}
