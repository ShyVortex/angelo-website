import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const { request } = context;
    try {
        const body = await request.json();
        const { _to, _ip, ...fields } = body;

        if (!_to) {
            return new Response(
                JSON.stringify({ error: "Missing recipient email address." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Safely get API key from multiple sources (local + Cloudflare Workers)
        // We avoid context.locals.runtime since in Astro v6 it throws a runtime error if its properties are accessed.
        const cloudflareEnv = (context.locals as any).cloudflare?.env;
        const apiKey = cloudflareEnv?.RESEND_API_KEY ||
            (globalThis as any).RESEND_API_KEY ||
            import.meta.env.RESEND_API_KEY ||
            (typeof process !== "undefined" ? process.env.RESEND_API_KEY : undefined);

        if (!apiKey) {
            throw new Error("RESEND_API_KEY is not defined in any environment source.");
        }

        console.log("RESEND_API_KEY caricata:", apiKey ? `${apiKey.substring(0, 6)}... (Lunghezza: ${apiKey.length})` : "undefined");

        // Construct email message body
        let emailText = `Nuovo messaggio dal modulo contatti del sito web.\n\n`;
        emailText += `Indirizzo IP Utente: ${_ip}\n`;
        emailText += `Destinatario: ${_to}\n`;
        emailText += `-------------------------------------------\n\n`;

        for (const [key, value] of Object.entries(fields)) {
            emailText += `${key}: ${value}\n`;
        }

        console.log("================ EMAIL DA INVIARE ================");
        console.log(emailText);
        console.log("=================================================");

        // Send email via Resend service
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Website Contact Form <onboarding@resend.dev>",
                to: _to,
                subject: "Nuovo messaggio dal modulo contatti",
                text: emailText
            })
        });
        if (!res.ok) {
            const errorDetails = await res.text();
            console.error("Dettagli errore Resend:", errorDetails);
            throw new Error(`Email service error (status ${res.status}): ${errorDetails}`);
        }

        // Simulate success
        return new Response(
            JSON.stringify({ message: "Email sent successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        console.error("Errore durante l'invio dell'email:", error);
        return new Response(
            JSON.stringify({
                error: "Errore interno del server durante l'invio.",
                details: error?.message || String(error)
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
