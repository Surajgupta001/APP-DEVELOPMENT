type SendEmailInput = {
    to: string;
    subject: string;
    html: string;
};

/**
 * Sends transactional email via the Resend HTTP API (no SDK dependency).
 *
 * Falls back to console logging when RESEND_API_KEY is not configured, so
 * local development keeps working (the verification link is printed instead).
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn(
            `[email] RESEND_API_KEY is not configured. Skipped sending "${subject}" to ${to}.`,
        );
        return;
    }

    const from = process.env.RESEND_FROM_EMAIL || "MyWorkout <onboarding@resend.dev>";

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject,
            html,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        console.error(`[email] Resend request failed (${response.status}): ${body}`);
        throw new Error("Failed to send email");
    }
}

export function buildVerificationOtpHtml(otp: string): string {
    return `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Your MyWorkout verification code</h2>
            <p>Enter this 6-digit code to activate your account:</p>
            <p style="font-size:32px;letter-spacing:12px;font-weight:bold;color:#16a34a;">${otp}</p>
            <p style="color:#6b7280;font-size:13px;">
                This code expires in 5 minutes. If you didn't create this account,
                you can safely ignore this email.
            </p>
        </div>
    `;
}

export function buildVerificationEmailHtml(verificationUrl: string, userName: string): string {
    return `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Welcome to MyWorkout, ${userName}! 🏋️</h2>
            <p>Please confirm your email address to activate your account:</p>
            <p>
                <a href="${verificationUrl}"
                   style="display:inline-block;padding:12px 24px;background:#16a34a;color:#ffffff;border-radius:8px;text-decoration:none;">
                    Verify my email
                </a>
            </p>
            <p style="color:#6b7280;font-size:13px;">
                If you didn't create this account, you can safely ignore this email.
            </p>
        </div>
    `;
}
