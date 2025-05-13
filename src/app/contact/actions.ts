// src/app/contact/actions.ts
'use server';

import { z } from 'zod';
import type { AppSettings, SmtpSettings } from '@/lib/types'; // Import AppSettings

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters."),
  email: z.string().email("Invalid email address.").max(100, "Email cannot exceed 100 characters."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message cannot exceed 1000 characters."),
});

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    general?: string[]; // For non-field specific errors
  };
}

// Default recipient if not configured via SMTP settings
const DEFAULT_TO_EMAIL_ADDRESS = 'info@slatenchalkmindcare.com';
const DEFAULT_FROM_EMAIL_ADDRESS = 'noreply@yourdomain.com'; // Fallback if not in SMTP settings

async function getSmtpConfiguration(): Promise<SmtpSettings | undefined> {
  try {
    // Fetch from the general settings endpoint
    // This fetch needs to be dynamic if API_BASE_URL can change at runtime,
    // or ensure API_BASE_URL is correctly set for server-side fetches.
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const response = await fetch(`${API_BASE_URL}/api/settings`, { cache: 'no-store' });
    if (response.ok) {
      const settings: AppSettings = await response.json();
      if (settings.smtpSettings && settings.smtpSettings.host) { // Check if host is configured as a sign of setup
        return settings.smtpSettings;
      }
    }
  } catch (error) {
    console.error("Failed to fetch SMTP settings for contact form:", error);
  }
  return undefined;
}

export async function sendContactEmailAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;
  const smtpConfig = await getSmtpConfiguration();

  try {
    if (smtpConfig && smtpConfig.host) {
      console.log('--- Using Configured SMTP Settings ---');
      console.log(`SMTP Host: ${smtpConfig.host}, Port: ${smtpConfig.port}, User: ${smtpConfig.user}, Secure: ${smtpConfig.secure}`);
      // In a real app, you would use nodemailer or a similar library here.
      // Example:
      // const transporter = nodemailer.createTransport({
      //   host: smtpConfig.host,
      //   port: smtpConfig.port,
      //   secure: smtpConfig.secure,
      //   auth: { user: smtpConfig.user, pass: smtpConfig.pass },
      // });

      // Send to Site Owner (using configured 'from' or default)
      const siteOwnerEmail = smtpConfig.fromEmail || DEFAULT_TO_EMAIL_ADDRESS; // Or a dedicated admin email from settings
      console.log('--- Simulating Email Sending (via SMTP config) to Site Owner ---');
      console.log(`To: ${DEFAULT_TO_EMAIL_ADDRESS}`); // Target email as per original request
      console.log(`From: "${name}" <${smtpConfig.fromEmail || DEFAULT_FROM_EMAIL_ADDRESS}>`);
      console.log(`Reply-To: "${name}" <${email}>`);
      console.log(`Subject: New Contact Form Submission from ${name} (via SMTP)`);
      console.log('--- Message Body ---');
      console.log(message);
      console.log('---------------------------------------------');
      // await transporter.sendMail({ from: `"${name}" <${smtpConfig.fromEmail}>`, to: DEFAULT_TO_EMAIL_ADDRESS, replyTo: email, subject: ..., html: ... });

      // Send Confirmation to User (using configured 'from' or default)
      console.log('\n--- Simulating Confirmation Email (via SMTP config) to User ---');
      console.log(`To: ${email}`);
      console.log(`From: "Slate & Chalk MindCare" <${smtpConfig.fromEmail || DEFAULT_FROM_EMAIL_ADDRESS}>`);
      console.log(`Subject: Thank you for contacting Slate & Chalk MindCare (via SMTP)`);
      console.log('--- Message Body (Copy) ---');
      console.log(`Hi ${name},\n\nThank you for reaching out. We received your message:\n\n"${message}"\n\nWe'll reply soon.\n\nBest,\nThe Slate & Chalk MindCare Team`);
      console.log('------------------------------------------');
      // await transporter.sendMail({ from: `"Slate & Chalk MindCare" <${smtpConfig.fromEmail}>`, to: email, subject: ..., html: ... });

    } else {
      console.warn('SMTP settings not configured or host not found. Falling back to console log simulation.');
      // Fallback simulation as before
      console.log('--- Simulating Email Sending to Site Owner (No SMTP Config) ---');
      console.log(`To: ${DEFAULT_TO_EMAIL_ADDRESS}`);
      console.log(`From: "${name}" <${DEFAULT_FROM_EMAIL_ADDRESS}>`);
      console.log(`Reply-To: "${name}" <${email}>`);
      console.log(`Subject: New Contact Form Submission from ${name}`);
      console.log('--- Message Body ---');
      console.log(message);
      console.log('---------------------------------------------');

      console.log('\n--- Simulating Confirmation Email to User (No SMTP Config) ---');
      console.log(`To: ${email}`);
      console.log(`From: "Slate & Chalk MindCare" <${DEFAULT_FROM_EMAIL_ADDRESS}>`);
      console.log(`Subject: Thank you for contacting Slate & Chalk MindCare`);
      console.log('--- Message Body (Copy) ---');
      console.log(`Hi ${name},\n\nThank you for reaching out to us. We have received your message:\n\n"${message}"\n\nWe will get back to you as soon as possible.\n\nBest regards,\nThe Slate & Chalk MindCare Team`);
      console.log('------------------------------------------');
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon. A copy of your message has been sent to your email address (simulated).',
    };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while trying to send your message. Please try again later.',
      errors: { general: ['Failed to send message due to a server error.'] }
    };
  }
}
