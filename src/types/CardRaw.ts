import type { LocalString } from "./LocalString";

export type CardRaw = {
    id: string;
    name: string | LocalString;
    category: string;
    rating?: number;
    icon: string;
    link?: string;
    tags: string[];
    date?: string;
}