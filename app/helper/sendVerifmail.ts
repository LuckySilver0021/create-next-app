import { resend} from '../lib/resend';
import VerificationEmail from '../components/email-template';
import { ApiResponse } from '../types/apiresponse';


export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse<any>> {
  try {
    await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Verification Code',
    react: VerificationEmail({ username: username, otp: verificationCode }),
  });
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