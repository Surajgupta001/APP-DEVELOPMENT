import { CATEGORY_KEYS_EXPENSE, CATEGORY_KEYS_INCOME } from "../../constants/categories";
import { ExtractedTransaction } from "../../types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        type: {
            type: "string",
            enum: ["EXPENSE", "INCOME"],
            nullable: true
        },
        amount: {
            type: "number",
            nullable: true
        },
        category: {
            type: "string",
            enum: [...CATEGORY_KEYS_EXPENSE, ...CATEGORY_KEYS_INCOME],
            nullable: true,
        },
        description: {
            type: "string",
            nullable: true
        },
        date: {
            type: "string",
            nullable: true
        },
        transcript: {
            type: "string",
            nullable: true
        },
    },
    required: ["type", "amount", "category", "description", "date", "transcript"],
    additionalProperties: false,
};

async function callGroqVision(promptText: string, mimeType: string, base64Image: string) {
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
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
                type: "json_schema",
                json_schema: {
                    name: "transaction",
                    strict: true,
                    schema: RESPONSE_SCHEMA,
                },
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
    const prompt = `You are reading a receipt photo for a personal finance app. Extract the transaction details.

    - "type" is always "EXPENSE" for a receipt.
    - "amount" is the final total paid (a plain number, no currency symbols).
    - "category" must be exactly one of: ${CATEGORY_KEYS_EXPENSE.join(", ")}.
    - "description" is a short label, ideally the merchant/store name.
    - "date" is the receipt date in YYYY-MM-DD format, if visible.
    - "transcript" must be null.
    - If any field can't be confidently determined from the image, set it to null.
    - Do not guess.`;

    return callGroqVision(prompt, mimeType, base64Image);
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
        throw new Error(`Groq transcription failed: ${errText}`);
    }

    const data = await res.json();

    if (!data?.text) {
        throw new Error("No transcription returned from Groq");
    }

    return data.text;
}

async function extractTransactionFromText(transcript: string): Promise<ExtractedTransaction> {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
    }

    const today = new Date().toISOString().slice(0, 10);

    const prompt = `You are extracting a personal finance transaction from a voice transcription.

    Today's date is ${today}.
    Transcript:
    "${transcript}"
    Extract the transaction details.
    - "type" is "EXPENSE" or "INCOME".
    - "amount" is the amount mentioned as a plain number.
    - "category" must be exactly one of:
      ${CATEGORY_KEYS_EXPENSE.join(", ")},
      ${CATEGORY_KEYS_INCOME.join(", ")}.
    - Use an expense category when type is EXPENSE.
    - Use an income category when type is INCOME.
    - "description" is a short label summarizing what the transaction was for.
    - "date" should be YYYY-MM-DD.
    - If the user mentions a relative date such as "yesterday" or "Monday", resolve it using today's date.
    - "transcript" must contain the exact transcription.
    - If a field cannot be confidently determined, set it to null.
    - Do not guess.`;

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
                type: "json_schema",
                json_schema: {
                    name: "transaction",
                    strict: true,
                    schema: RESPONSE_SCHEMA,
                },
            },
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq extraction failed: ${errText}`);
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