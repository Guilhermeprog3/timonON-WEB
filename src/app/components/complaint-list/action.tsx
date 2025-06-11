"use server"

import type { Complaint } from "@/app/types/complaint"

const mockComplaints: Complaint[] = [
  {
    id: "REC-2023-001",
    title: "Buraco na Rua Principal",
    category: "Infraestrutura",
    neighborhood: "Centro",
    status: "Pendente",
    date: "14/05/2023",
  },
  {
    id: "REC-2023-002",
    title: "Falta de Iluminação na Praça Central",
    category: "Iluminação",
    neighborhood: "Parque Piauí",
    status: "Em Andamento",
    date: "13/05/2023",
  },
  {
    id: "REC-2023-003",
    title: "Lixo acumulado na Avenida Brasil",
    category: "Limpeza",
    neighborhood: "São Benedito",
    status: "Resolvido",
    date: "11/05/2023",
  },
  {
    id: "REC-2023-004",
    title: "Semáforo com defeito no cruzamento",
    category: "Infraestrutura",
    neighborhood: "Centro",
    status: "Pendente",
    date: "10/05/2023",
  },
  {
    id: "REC-2023-005",
    title: "Vazamento de água na Rua das Flores",
    category: "Saneamento",
    neighborhood: "Jardim Primavera",
    status: "Em Andamento",
    date: "09/05/2023",
  },
]

export async function getComplaints(): Promise<Complaint[]> {

  return mockComplaints
}

export async function getComplaintsByFilters(filters: {
  search?: string
  status?: string
  category?: string
  neighborhood?: string
}): Promise<Complaint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredComplaints = [...mockComplaints]

  if (filters.search) {
    filteredComplaints = filteredComplaints.filter(
      (complaint) =>
        complaint.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        complaint.id.toLowerCase().includes(filters.search!.toLowerCase()),
    )
  }

  if (filters.status && filters.status !== "all") {
    filteredComplaints = filteredComplaints.filter((complaint) => complaint.status === filters.status)
  }

  if (filters.category && filters.category !== "all") {
    filteredComplaints = filteredComplaints.filter((complaint) => complaint.category === filters.category)
  }

  if (filters.neighborhood && filters.neighborhood !== "all") {
    filteredComplaints = filteredComplaints.filter((complaint) => complaint.neighborhood === filters.neighborhood)
  }

  return filteredComplaints
}

export async function getCategories(): Promise<string[]> {
  return ["Infraestrutura", "Iluminação", "Limpeza", "Saneamento", "Transporte"]
}

export async function getNeighborhoods(): Promise<string[]> {
  return ["Centro", "Parque Piauí", "São Benedito", "Jardim Primavera", "Vila Nova"]
}
