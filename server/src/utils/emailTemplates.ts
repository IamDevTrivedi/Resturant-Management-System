export const verifyEmailTemplate = (OTP: string): string => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 5px;">${OTP}</h1>
      <p>This code will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
};

export const resetPasswordVerifyTemplate = (OTP: string): string => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Your OTP code for password reset is:</p>
      <h1 style="letter-spacing: 5px;">${OTP}</h1>
      <p>This code will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
};
