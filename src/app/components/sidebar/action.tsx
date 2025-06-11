
"use client";
import Cookies from 'js-cookie';
import { api } from '@/app/service/server';

export const logoutAction = async () => {
  try {
    const token = Cookies.get('JWT');
    if (token) {
      await api.delete('admin/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Cookies.remove('JWT');
      window.location.reload();

    }
  } catch (error) {
    console.error('Falha ao fazer logout no servidor:', error);
  }
};