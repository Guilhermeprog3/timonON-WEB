"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminData } from "./types";
import { Mail, Lock, Pencil, UserCircle } from "lucide-react";
import { useState } from "react";
import { PasswordResetModal } from "./PasswordResetModal";
import { EditProfileModal } from "./EditProfileModal";

interface SettingsProps {
  admin: AdminData;
}

export function Settings({ admin }: SettingsProps) {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-primary-foreground/80 text-sm">Gerencie suas preferências e configurações de conta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <UserCircle className="w-5 h-5" />
            {admin.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
             <Mail className="w-4 h-4" />
            {admin.email}
          </p>
        </CardHeader>
        <CardContent className="flex gap-2 pb-6">
          <Badge variant="secondary">{admin.role}</Badge>
          {admin.department ? (
            <Badge variant="outline">{admin.department.name}</Badge>
          ) : (
            <Badge variant="outline" className="opacity-60 italic">
              Sem departamento
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-primary">Conta</CardTitle>
          <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais e preferências</p>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-medium">Informações Pessoais</p>
              <p className="text-muted-foreground text-sm">Nome, email e dados de contato</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setEditProfileModalOpen(true)}>
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Alterar Senha</p>
              <p className="text-muted-foreground text-sm">Mantenha sua conta segura com uma senha forte</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPasswordModalOpen(true)}>
              <Lock className="w-4 h-4 mr-1" />
              Alterar
            </Button>
          </div>
        </CardContent>
      </Card>

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