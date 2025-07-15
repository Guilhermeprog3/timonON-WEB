export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
  status: 'Ativo' | 'Inativo';
}

export interface Departament {
  id: number;
  name: string;
}