import type { FormParam } from "../types/FormParam";

interface FormTextArea {
    input: FormParam;
    area: HTMLInputElement | HTMLTextAreaElement;
}

export function validate(inputs: FormParam[]): boolean {
    let textAreas: FormTextArea[] = [];

    for (const input of inputs) {
        // Generate same ID used in the Form.astro component
        const inputId = input.name.en.toLowerCase().replace(/\s+/g, "-");
        const htmlElement = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement | null;

        if (!htmlElement) {
            console.warn(`Element with ID "${inputId}" not found.`);
            continue;
        }

        const formTextArea: FormTextArea = {
            input: input,
            area: htmlElement
        }

        textAreas.push(formTextArea);
    }

    for (const formAreaObj of textAreas) {
        const text: string = formAreaObj.area.value.trim();
        const minLength: number | undefined = formAreaObj.input.minLength;
        const maxLength: number | undefined = formAreaObj.input.maxLength;
        const allowNumbers: boolean = formAreaObj.input.allowNumbers;
        const allowSpecialChars: boolean = formAreaObj.input.allowSpecialChars;
        const allowedSpecialChars: string[] | undefined = formAreaObj.input.allowedSpecialChars;
        const allowSpacing: boolean = formAreaObj.input.allowSpacing;
        const required: boolean = formAreaObj.input.required;

        // Handle empty fields (optional or required)
        if (text === "") {
            if (required) return false; // Error: required field is empty
            continue; // Valid: optional field empty, skip
        }

        const digits: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        const specialChars: string[] = ["!", ".", "#", "/", "@", "+", "-", "_", "{", "}", "[", "]", "&"];

        if (minLength && text.length < minLength) return false;
        if (maxLength && text.length > maxLength) return false;
        if (!allowNumbers && digits.some(digit => text.includes(digit))) return false;

        // Verify special character
        if (!allowSpecialChars) {
            // If no special characters are allowed, none of the chars in specialChars must be present
            if (specialChars.some(char => text.includes(char))) return false;
        } else if (allowedSpecialChars) {
            // If only some are allowed, those chars not present in the whitelist should not be present
            const forbiddenChars = specialChars.filter(char => !allowedSpecialChars.includes(char));
            if (forbiddenChars.some(char => text.includes(char))) return false;
        }

        if (!allowSpacing && text.includes(" ")) return false;
    }

    return true;
}

async function getPublicIp(): Promise<string> {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) throw new Error();
        const data = await response.json();
        return data.ip || "Sconosciuto";
    } catch {
        return "Sconosciuto";
    }
}

export async function sendEmail(inputs: FormParam[]): Promise<boolean> {
    const ip = await getPublicIp();
    const payload: Record<string, string> = {
        _to: "angelotr@ik.me",
        _ip: ip
    };

    for (const input of inputs) {
        const inputId = input.name.en.toLowerCase().replace(/\s+/g, "-");
        const htmlElement = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement | null;
        if (htmlElement) {
            payload[input.name.en] = htmlElement.value;
        }
    }

    try {
        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        return response.ok;
    } catch (error) {
        console.error("Errore di rete durante l'invio:", error);
        return false;
    }
}