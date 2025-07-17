export interface Citizen {
    name: string;
    email: string;
    cpf: string;
}

export type Status = "Pendente" | "Em Andamento" | "Resolvido";

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
    status: Status;
    comment: string;
    userName: string;
}

export interface Sector {
    id: string;
    name: string;
}

export interface ApiComment {
    id: number;
    text: string;
    user?: {
        id: number;
        name: string;
        avatarUrl?: string;
    };
    totalLikes: string | number;
    likedByUser?: boolean;
}

export interface Comment {
    id: number;
    text: string;
    user: {
        id: number;
        name: string;
        avatarUrl?: string;
    };
    totalLikes: number;
    likedByUser: boolean;
}

export interface ComplaintDetailsData {
    id: string;
    title: string;
    description: string;
    status: Status;
    category: string;
    department: string;
    creation_date: string;
    updatedAt: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    photo_url: string | null;
    citizen: Citizen;
    updates: ComplaintUpdate[];
    comment?: string | null;
    comments: Comment[];
}