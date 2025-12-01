const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn(
      "Resend API credentials missing. Set RESEND_API_KEY and RESEND_FROM_EMAIL to send verification emails."
    );
    console.info(`Verification link for ${email}: ${verifyUrl}`);
    return;
  }

  const payload = {
    from: fromEmail,
    to: email,
    subject: "Verify your Beyond Hunger account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Verify your email</h2>
        <p>Thanks for creating an account with Beyond Hunger. Please confirm your email by clicking the button below.</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 20px;background:#ff2121;color:#fff;text-decoration:none;border-radius:6px;">
            Verify email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `
  };

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send verification email", error);
    }
  } catch (err) {
    console.error("Resend API error", err);
  }
}
