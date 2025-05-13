// src/app/contact/actions.ts
'use server';

import { z } from 'zod';

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

// Environment variable for the recipient email, defaulting to the requested address
const TO_EMAIL_ADDRESS = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@slatenchalkmindcare.com';
// It's good practice to have a dedicated sender email for your application
const FROM_EMAIL_ADDRESS = process.env.CONTACT_FORM_SENDER_EMAIL || 'noreply@yourdomain.com';


export async function sendContactEmailAction(
  prevState: ContactFormState, // Changed from any to ContactFormState
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

  try {
    // Simulate sending email by logging to the console
    // In a real application, you would integrate an email service provider (e.g., Resend, SendGrid, AWS SES)
    console.log('--- Simulating Email Sending ---');
    console.log(`To: ${TO_EMAIL_ADDRESS}`);
    console.log(`From: "${name}" <${FROM_EMAIL_ADDRESS}>`); // Use a fixed sender email, and user's name in "From" display name
    console.log(`Reply-To: "${name}" <${email}>`); // Set Reply-To to the user's actual email
    console.log(`Subject: New Contact Form Submission from ${name}`);
    console.log('--- Message Body ---');
    console.log(message);
    console.log('---------------------------');

    // Example for a real email service (e.g. Resend - requires setup and API key)
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: `Contact Form <${FROM_EMAIL_ADDRESS}>`,
    //   to: [TO_EMAIL_ADDRESS],
    //   reply_to: email, // User's email
    //   subject: `New Contact Form Submission from ${name}`,
    //   html: `
    //     <h1>New Contact Form Submission</h1>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <hr>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `,
    // });

    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));


    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  } catch (error) {
    console.error('Error sending contact email (simulation):', error);
    // In a real scenario, you'd log this error to a monitoring service
    return {
      success: false,
      message: 'An unexpected error occurred while trying to send your message. Please try again later.',
      errors: { general: ['Failed to send message due to a server error.'] }
    };
  }
}
