import { CATEGORY_KEYS_EXPENSE, CATEGORY_KEYS_INCOME } from "../../constants/categories";
import { ExtractedTransaction } from "../../types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

async function callGroqVision(promptText: string, mimeType: string, base64Image: string): Promise<ExtractedTransaction> {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
    }

    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "qwen/qwen3.6-27b",

            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: promptText,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],

            response_format: {
                type: "json_object",
            },
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq request failed: ${errText}`);
    }

    const data = await res.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error("No response from Groq");
    }

    return JSON.parse(text) as ExtractedTransaction;
}

export async function extractTransactionFromReceipt(base64Image: string, mimeType: string): Promise<ExtractedTransaction> {
    const prompt = `
    You are reading a receipt photo for a personal finance app.

    Return ONLY a valid JSON object with these exact fields:

    {
        "type": "EXPENSE",
        "amount": number or null,
        "category": string or null,
        "description": string or null,
        "date": "YYYY-MM-DD" or null,
        "transcript": null
    }

    Rules:

    - "type" must always be "EXPENSE".
    - "amount" is the final total paid.
    - Amount must be a plain number without currency symbols.
    - "category" must be exactly one of:
      ${CATEGORY_KEYS_EXPENSE.join(", ")}
    - "description" should ideally be the merchant/store name.
    - "date" must be YYYY-MM-DD if visible on the receipt.
    - "transcript" must always be null.
    - If a field cannot be confidently determined, use null.
    - Do not guess.
    `;

    return callGroqVision(
        prompt,
        mimeType,
        base64Image
    );
}

async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
    }

    const binary = Uint8Array.from(
        atob(base64Audio),
        (char) => char.charCodeAt(0)
    );

    const blob = new Blob([binary], {
        type: mimeType,
    });

    const formData = new FormData();

    formData.append("file", blob, "voice-recording.m4a");

    formData.append("model", "whisper-large-v3-turbo");

    formData.append("response_format", "json");

    const res = await fetch(GROQ_AUDIO_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const errText = await res.text();

        throw new Error(
            `Groq transcription failed: ${errText}`
        );
    }

    const data = await res.json();

    if (!data?.text) {
        throw new Error(
            "No transcription returned from Groq"
        );
    }

    return data.text;
}

async function extractTransactionFromText(transcript: string): Promise<ExtractedTransaction> {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
    }

    const today = new Date().toISOString().slice(0, 10);

    const prompt = `
    You are extracting a personal finance transaction from a voice transcription.

    Today's date is ${today}.

    Transcript:
    "${transcript}"

    Return ONLY a valid JSON object with these exact fields:

    {
        "type": "EXPENSE" or "INCOME" or null,
        "amount": number or null,
        "category": string or null,
        "description": string or null,
        "date": "YYYY-MM-DD" or null,
        "transcript": string or null
    }

    Rules:

    - "type" must be EXPENSE or INCOME.
    - "amount" is the amount mentioned as a plain number.
    - "category" must be exactly one of:

    Expense categories:
    ${CATEGORY_KEYS_EXPENSE.join(", ")}

    Income categories:
    ${CATEGORY_KEYS_INCOME.join(", ")}

    - If type is EXPENSE, use only an expense category.
    - If type is INCOME, use only an income category.
    - "description" should briefly describe the transaction.
    - "date" must be YYYY-MM-DD.
    - Resolve relative dates such as "today", "yesterday", or "Monday" using today's date.
    - "transcript" must contain the exact transcription.
    - If something cannot be confidently determined, use null.
    - Do not guess.
    `;

    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],

            response_format: {
                type: "json_object",
            },
        }),
    });

    if (!res.ok) {
        const errText = await res.text();

        throw new Error(
            `Groq extraction failed: ${errText}`
        );
    }

    const data = await res.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error("No response from Groq");
    }

    return JSON.parse(text) as ExtractedTransaction;
}

export async function extractTransactionFromVoice(base64Audio: string, mimeType: string): Promise<ExtractedTransaction> {
    const transcript = await transcribeAudio(base64Audio, mimeType);

    return extractTransactionFromText(transcript);
}