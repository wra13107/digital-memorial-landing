import { ENV } from './_core/env';

/**
 * Send email using Manus built-in notification API
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  try {
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.error('[Email] Forge API credentials not configured');
      return false;
    }

    const response = await fetch(`${ENV.forgeApiUrl}/notification/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      console.error('[Email] Failed to send email:', response.statusText);
      return false;
    }

    console.log(`[Email] Successfully sent email to ${options.to}`);
    return true;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return false;
  }
}

/**
 * Send welcome email to new user with credentials
 */
export async function sendWelcomeEmail(options: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  loginUrl: string;
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #2C353D;
            background-color: #FDFBF7;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #C49F64 0%, #b8934f 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .credentials {
            background-color: #F0F4F8;
            border-left: 4px solid #C49F64;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .credentials p {
            margin: 10px 0;
            font-size: 14px;
          }
          .credentials strong {
            color: #2C353D;
          }
          .login-button {
            display: inline-block;
            background-color: #C49F64;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin: 30px 0;
          }
          .login-button:hover {
            background-color: #b8934f;
          }
          .footer {
            background-color: #FDFBF7;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #6E7A85;
            border-top: 1px solid #E8E8E8;
          }
          .footer a {
            color: #C49F64;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Добро пожаловать в Demoria</h1>
          </div>
          <div class="content">
            <p class="greeting">Привет, ${options.firstName}!</p>
            
            <p>Ваша учетная запись была успешно создана. Ниже вы найдете информацию для входа:</p>
            
            <div class="credentials">
              <p><strong>Email:</strong> ${options.email}</p>
              <p><strong>Пароль:</strong> ${options.password}</p>
            </div>
            
            <p>Пожалуйста, измените пароль после первого входа для безопасности.</p>
            
            <div style="text-align: center;">
              <a href="${options.loginUrl}" class="login-button">Войти в систему</a>
            </div>
            
            <p>Если у вас есть вопросы, не стесняйтесь обратиться в нашу службу поддержки.</p>
            
            <p>С уважением,<br>Команда Demoria</p>
          </div>
          <div class="footer">
            <p>© 2026 Demoria. Все права защищены.</p>
            <p><a href="#">Политика конфиденциальности</a> | <a href="#">Условия использования</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: options.email,
    subject: `Добро пожаловать в Demoria, ${options.firstName}!`,
    html,
  });
}
