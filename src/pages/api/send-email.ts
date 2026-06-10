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

        // Recupera la chiave API in modo sicuro da più sorgenti (locale + Cloudflare Workers)
        const runtime = (context.locals as any).runtime;
        const apiKey = runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || (typeof process !== "undefined" ? process.env.RESEND_API_KEY : undefined);

        console.log("RESEND_API_KEY caricata:", apiKey ? `${apiKey.substring(0, 6)}... (Lunghezza: ${apiKey.length})` : "undefined");

        // Costruisci il corpo del messaggio email
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

        // Invia email tramite servizio Resend
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

        // Simula successo
        return new Response(
            JSON.stringify({ message: "Email sent successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Errore durante l'invio dell'email:", error);
        return new Response(
            JSON.stringify({ error: "Errore interno del server durante l'invio." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
