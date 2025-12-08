import emailjs from '@emailjs/browser';

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_your_service_id', // Replace with your EmailJS service ID
  TEMPLATE_ID: 'template_your_template_id', // Replace with your EmailJS template ID
  PUBLIC_KEY: 'your_public_key', // Replace with your EmailJS public key
  RECIPIENT_EMAIL: 'playerofchess27@gmail.com'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Email sending function with security measures
export const sendContactEmail = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  // Input validation and sanitization
  const sanitizedData = {
    firstName: sanitizeInput(formData.firstName),
    lastName: sanitizeInput(formData.lastName),
    email: sanitizeEmail(formData.email),
    phone: sanitizeInput(formData.phone),
    subject: sanitizeInput(formData.subject),
    message: sanitizeInput(formData.message),
    recipient_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    referrer: document.referrer
  };

  // Validate required fields
  if (!sanitizedData.firstName || !sanitizedData.lastName || !sanitizedData.email || !sanitizedData.subject || !sanitizedData.message) {
    throw new Error('All required fields must be filled');
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedData.email)) {
    throw new Error('Please enter a valid email address');
  }

  // Rate limiting check (simple implementation)
  const lastSubmission = localStorage.getItem('lastContactSubmission');
  const now = Date.now();
  if (lastSubmission && now - parseInt(lastSubmission) < 60000) { // 1 minute cooldown
    throw new Error('Please wait before sending another message');
  }

  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      sanitizedData
    );

    // Store submission timestamp for rate limiting
    localStorage.setItem('lastContactSubmission', now.toString());

    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send message. Please try again later.');
  }
};

// Input sanitization functions
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  // Remove potentially harmful characters and trim
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 1000); // Limit length
};

const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  // Basic email sanitization
  return email
    .toLowerCase()
    .trim()
    .substring(0, 254); // RFC 5321 limit
};
