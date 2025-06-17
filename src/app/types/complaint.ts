export interface Citizen {
    name: string;
    email: string;
    cpf: string;
}
export interface Complaint {
    id: string
    title: string
    category: string
    status: "Pendente" | "Em Andamento" | "Resolvido"
    date: string
}

export interface ComplaintUpdate {
    id: string;
    timestamp: string;
    status: "Pendente" | "Em Andamento" | "Resolvido";
    comment: string;
    userName: string;
}

export interface Sector {
    id: string;
    name: string;
}

export interface ComplaintDetailsData {
    id: string;
    title: string;
    description: string;
    status: "Pendente" | "Em Andamento" | "Resolvido";
    category: string;
    creation_date: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    photo_url: string | null;
    citizen: Citizen;
    updates: ComplaintUpdate[];
}