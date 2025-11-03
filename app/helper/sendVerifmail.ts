import { sendBrevoEmail } from '../lib/brevo';
import { generateVerificationEmailHTML } from '../components/email-template-html';
import { ApiResponse } from '../types/apiresponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse<any>> {
  try {
    const htmlContent = generateVerificationEmailHTML(username, verificationCode);
    const result = await sendBrevoEmail(
      email,
      'Verification Code',
      htmlContent
    );
    
    if (!result.success) {
      console.error('[sendVerificationEmail] Brevo send failed:', result.error);
      const errCode = result.error?.code || 'send_failed';
      const errBody = result.error?.body || result.error;
      return {
        success: false,
        message: 'Failed to send verification email.',
        error: { code: errCode, details: errBody },
      } as ApiResponse<any>;
    }

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  }
  catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email. Please try again later.',
    };
  }}