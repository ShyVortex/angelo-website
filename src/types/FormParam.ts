import type { LocalString } from "./LocalString";

export type FormParam = {
    name: LocalString;
    type: 'line' | 'block';
    minLength?: number;
    maxLength?: number;
    allowSpecialChars: boolean;
    allowedSpecialChars?: string[];
    allowNumbers: boolean;
    allowSpacing: boolean;
    required: boolean;
    info?: LocalString;
}