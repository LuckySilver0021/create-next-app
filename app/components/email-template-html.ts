export function generateVerificationEmailHTML(username: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Verification Code</title>
      <style>
        body {
          font-family: 'Roboto', Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #1a73e8;
          padding: 12px 24px;
          background-color: #f1f3f4;
          border-radius: 4px;
          display: inline-block;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <div class="otp-code">${otp}</div>
        <p>If you did not request this code, please ignore this email.</p>
        <p>This code will expire in 1 hour.</p>
      </div>
    </body>
    </html>
  `;
}