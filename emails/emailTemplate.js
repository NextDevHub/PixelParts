const generateEmailTemplate = (userName, verificationLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #6c757d;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background-color: #4682b4; /* Softer blue color */
      color: #ffffff; /* Button text color */
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #5a9bd4; /* Slightly darker blue for hover effect */
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777777;
      background-color: #f4f4f4;
    }
    a {
      color: #4682b4; /* Softer blue color for links */
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Verify Your Account</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p>Hello ${userName},</p>
      <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
      <a href="${verificationLink}" class="button">Verify My Account</a>
      <p>This verification code will expire in 10 minutes.</p>
      <p>If you didn’t create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>Pixel Parts</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you’re having trouble with the button above, copy and paste the link below into your browser:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

export { generateEmailTemplate };
