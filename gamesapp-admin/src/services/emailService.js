import { EMAIL_CONFIG, EMAIL_TEMPLATES } from '../config/email';

export const sendEmail = async (to, template, data) => {
  console.log(`📧 Sending email to ${to} using template: ${template}`);
  console.log('📧 Email data:', data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Email sent successfully' });
    }, 1000);
  });
};

export const sendWelcomeEmail = async (email, name) => {
  return sendEmail(email, 'welcome', { name });
};

export const sendPremiumApprovedEmail = async (email, name, contentName) => {
  return sendEmail(email, 'premium_approved', { name, contentName });
};

export const sendPremiumRejectedEmail = async (email, name, contentName) => {
  return sendEmail(email, 'premium_rejected', { name, contentName });
};

export const sendNewContentEmail = async (email, name, contentName, contentType) => {
  return sendEmail(email, 'new_content', { name, contentName, contentType });
};
