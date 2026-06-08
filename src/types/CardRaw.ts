export type CardRaw = {
    id: string;
    name: string;
    category: string;
    rating?: number;
    icon: string;
    link?: string;
    tags: string[];
    date?: string;
}