// src/app/(private_pages)/settings/types.ts

export interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: {
    id: number;
    name: string;
  };
}
