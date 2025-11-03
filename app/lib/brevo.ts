const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const brevoApiKey = process.env.BREVO_API_KEY || '';
console.log('[Brevo] Using API Key:', brevoApiKey ? `${brevoApiKey.slice(0, 8)}...` : 'NOT SET');

export async function sendBrevoEmail(
  to: string,
  subject: string,
  htmlContent: string,
  senderEmail: string = process.env.BREVO_SENDER_EMAIL || '',
  senderName: string = process.env.BREVO_SENDER_NAME || 'Project Demo'
) {
  // Validate recruiter email
  if (!to || !to.includes('@')) {
    console.error('[Brevo] Invalid recipient email:', to);
    return { success: false, error: { code: 'invalid_recipient' } };
  }

  // Add recruitment-friendly logging
  console.log('[Demo Project] Sending verification email to:', to);

  // Log the exact sender being used
  console.log('[Brevo] Attempting to send with:', {
    senderEmail,
    senderName,
    to,
    subject
  });

  // Build payload according to Brevo REST API v3
  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  console.log('[Brevo] Sending email (fetch):', {
    to,
    subject,
    senderEmail,
    senderName,
    htmlLength: htmlContent.length,
    payloadSample: JSON.stringify({ subject, to: payload.to })
  });

  if (!brevoApiKey) {
    const err = new Error('BREVO_API_KEY is not set in environment');
    console.error('[Brevo] Aborting send -', err.message);
    return { success: false, error: err };
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    // Detailed logging
    console.log('[Brevo] Response:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body
    });

    if (!res.ok) {
      return {
        success: false,
        error: {
          code: res.status,
          message: body?.message || text,
          details: body
        }
      };
    }

    console.log('[Brevo] Email sent successfully to:', to);
    return { success: true, data: body };
  } catch (error: any) {
    console.error('[Demo Project] Failed to send email:', error.message);
    return { success: false, error };
  }
}