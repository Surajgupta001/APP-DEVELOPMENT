import { wrapEmail } from "../_shared/emailLayout";
import { sendEmail } from "../_shared/resend";
import { createSupabaseAdmin } from "../_shared/supabaseAdmin";

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

Deno.serve(async () => {
    const supabase = createSupabaseAdmin();
    const now = new Date();

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("clerk_id, email, name, currency");
    if (usersError) throw usersError;

    let sent = 0;

    for (const user of users ?? []) {
        if (!user.email) continue;

        const { data: expenseRows } = await supabase
            .from("transactions")
            .select("amount, category")
            .eq("user_id", user.clerk_id)
            .eq("type", "EXPENSE")
            .gte("date", weekAgo.toISOString());

        const { data: incomeRows } = await supabase
            .from("transactions")
            .select("amount")
            .eq("user_id", user.clerk_id)
            .eq("type", "INCOME")
            .gte("date", weekAgo.toISOString());

        const totalExpense = (expenseRows ?? []).reduce((sum, tx) => sum + tx.amount, 0);
        const totalIncome = (incomeRows ?? []).reduce((sum, tx) => sum + tx.amount, 0);

        if (totalExpense === 0 && totalIncome === 0) continue;

        const byCategory: Record<string, number> = {};
        for (const tx of expenseRows ?? []) {
            byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
        }

        try {
            const tips = await generateTips({
                currency: user.currency ?? "USD",
                byCategory,
                totalExpense,
                totalIncome,
            });

            const html = wrapEmail(`
                <p style="margin:0 0 16px;">Hi ${user.name ?? "there"},</p>
                <p style="margin:0 0 20px;">Here are your personalized finance tips for this week:</p>
                <ul style="padding-left:20px;margin:0 0 20px;">
                    ${tips.map((tip) => `<li style="margin-bottom:8px;">${tip}</li>`).join("")}
                </ul>
                <p style="margin:0;color:#5C5F68;">Keep tracking your spending in Welth to get more tailored advice!</p>
            `);

            await sendEmail({
                to: user.email,
                subject: "Welth Weekly Tips: Personalized finance advice",
                html,
            });
            sent++;
        } catch (err) {
            console.error(`Failed to send weekly tips to ${user.email}:`, err);
        }
    }

    return new Response(JSON.stringify({ sent }), {
        headers: { "Content-Type": "application/json" },
    });
});