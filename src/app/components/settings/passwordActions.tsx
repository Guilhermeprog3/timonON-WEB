// src/app/components/settings/passwordActions.tsx
"use server";

import { cookies } from "next/headers";

export async function sendResetCode(email: string): Promise<boolean> {
  const res = await fetch("https://infra-timon-on.onrender.com/restore/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res.ok;
}

export async function confirmResetCode(email: string, code: string): Promise<string | null> {
  const res = await fetch("https://infra-timon-on.onrender.com/restore/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.id as string;
}

export async function setNewPassword(id: string, password: string): Promise<boolean> {
  const res = await fetch(`https://infra-timon-on.onrender.com/restore/new-password/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  return res.ok;
}
