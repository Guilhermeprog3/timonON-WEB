export interface Complaint {
  id: string
  title: string
  category: string
  neighborhood: string
  status: "Pendente" | "Em Andamento" | "Resolvido"
  date: string
}

export interface ComplaintFilters {
  search: string
  status: string
  category: string
  neighborhood: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}
