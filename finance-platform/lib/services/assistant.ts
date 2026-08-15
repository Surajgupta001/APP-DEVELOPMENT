import { format, isSameMonth, subDays } from "date-fns";
import { Budget, Transaction } from "../../types";
import { getCategoryConfig } from "../../constants/categories";
import { formatPrice } from "../utils";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function buildContext(transaction: Transaction[], budget: Budget | null, currency: string) {
    const now = new Date();
    const cutoff = subDays(now, 30);

    const recent = transaction.filter((t) => new Date(t.date) >= cutoff);

    const thisMonthExpense = transaction
        .filter(
            (tx) =>
                tx.type === "EXPENSE" &&
                isSameMonth(new Date(tx.date), now)
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

    const spentByCategory: Record<string, number> = {};

    let income = 0;
    let expense = 0;

    recent.forEach((tx) => {
        if (tx.type === "EXPENSE") {
            expense += tx.amount;
            spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + tx.amount;
        } else {
            income += tx.amount;
        }
    });

    const categoryLines = Object.entries(spentByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(
            ([category, amount]) =>
                `- ${getCategoryConfig(category as any).label}: ${formatPrice(
                    amount,
                    currency
                )}`
        )
        .join("\n");

    const budgetLine = budget
        ? `${formatPrice(
            thisMonthExpense,
            currency
        )} spent of ${formatPrice(
            budget.amount,
            currency
        )} budget used.`
        : "No budget set.";

    const txLines = recent
        .slice(0, 40)
        .map(
            (tx) =>
                `- ${format(
                    new Date(tx.date),
                    "d MMM yyyy"
                )} | ${tx.type} | ${getCategoryConfig(tx.category).label
                } | ${formatPrice(
                    tx.amount,
                    currency
                )}${tx.description
                    ? ` | ${tx.description}`
                    : ""
                }`
        )
        .join("\n");

    return `Last 30 days summary:

    Total income: ${formatPrice(income, currency)}
    Total expense: ${formatPrice(expense, currency)}

    Spending by category:
    ${categoryLines || "No expenses recorded."}

    Monthly budget:
    ${budgetLine}

    Recent transactions:
    ${txLines || "No transactions recorded."}`;
}

export async function askAssistant(question: string, transaction: Transaction[], budget: Budget | null, currency: string) {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
    }

    const context = buildContext(transaction, budget, currency);

    const prompt = `You are a helpful personal finance assistant inside the Welth app.

    Answer the user's question using ONLY the financial data provided below.

    Be concise, clear, and specific with numbers.

    If the provided financial data does not contain enough information to answer the question, say so instead of guessing.

    Financial data:

    ${context}

    User question:
    ${question}`;

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
                        "You are a helpful personal finance assistant. Only use the financial data provided by the application.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
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

    return text as string;
}