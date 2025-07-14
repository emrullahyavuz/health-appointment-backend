const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Adresinizi Doğrulayın - Health Appointment System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; text-align: center;">Email Adresinizi Doğrulayın</h2>
          <p>Merhaba ${name},</p>
          <p>Health Appointment Management System'e kayıt olduğunuz için teşekkür ederiz.</p>
          <p>Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3498db; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Email Adresimi Doğrula
            </a>
          </div>
          <p>Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
          <p style="word-break: break-all; color: #7f8c8d;">${verificationUrl}</p>
          <p>Bu link 24 saat geçerlidir.</p>
          <p>Eğer bu email'i siz talep etmediyseniz, lütfen dikkate almayın.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ecf0f1;">
          <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
            Health Appointment Management System
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Şifre Sıfırlama - Health Appointment System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; text-align: center;">Şifre Sıfırlama</h2>
          <p>Merhaba ${name},</p>
          <p>Şifrenizi sıfırlama talebinde bulundunuz.</p>
          <p>Yeni şifre belirlemek için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #e74c3c; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          <p>Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
          <p style="word-break: break-all; color: #7f8c8d;">${resetUrl}</p>
          <p>Bu link 1 saat geçerlidir.</p>
          <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, lütfen dikkate almayın.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ecf0f1;">
          <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
            Health Appointment Management System
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendPasswordResetEmail
}; 