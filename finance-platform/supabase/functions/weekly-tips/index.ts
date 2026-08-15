const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GenerateTipsParams {
    currency: string;
    byCategory: Record<string, number>;
    totalExpense: number;
    totalIncome: number;
}

async function generateTips({
    currency,
    byCategory,
    totalExpense,
    totalIncome,
}: GenerateTipsParams) {
    const apiKey = Deno.env.get("GROQ_API_KEY");

    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY");
    }

    const breakdown = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .map(
            ([category, amount]) =>
                `${category}: ${amount.toFixed(2)} ${currency}`
        )
        .join(", ");

    const prompt = `
You are a friendly personal finance coach.

Based on this user's last 7 days of activity, write 2-4 short,
specific, actionable tips (maximum 20 words each) to help them
save money or manage their finances better.

Be encouraging, not preachy.
Do not give generic advice unless it is clearly relevant.

Total income this week: ${totalIncome.toFixed(2)} ${currency}
Total expenses this week: ${totalExpense.toFixed(2)} ${currency}
Spending by category: ${breakdown || "none"}

Return ONLY valid JSON in exactly this format:

{
  "tips": ["tip 1", "tip 2"]
}
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
                    role: "system",
                    content:
                        "You are a friendly and practical personal finance coach. Return only valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],

            response_format: {
                type: "json_object",
            },

            include_reasoning: false,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq request failed: ${errorText}`);
    }

    const data = await res.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error("No response from Groq");
    }

    const result = JSON.parse(text);

    if (!Array.isArray(result?.tips)) {
        throw new Error("Invalid response from Groq: tips array missing");
    }

    return result.tips as string[];
}