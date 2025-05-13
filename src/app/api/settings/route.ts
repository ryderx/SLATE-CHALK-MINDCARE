// src/app/api/settings/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import type { AppSettings, SocialLinks, SmtpSettings } from '@/lib/types';
import { isAdminSession } from '@/lib/auth-utils';

// In a real application, this data would come from a database or secure configuration store.
// For now, let's use a simple in-memory object (this will reset on server restart).
let appSettings: AppSettings = {
  socialLinks: {
    linkedin: 'https://www.linkedin.com/your-profile',
    instagram: 'https://www.instagram.com/your-profile',
    facebook: 'https://www.facebook.com/your-profile',
  },
  smtpSettings: {
    host: '',
    port: 587, // Default common port
    user: '',
    pass: '', // WARNING: Storing passwords in-memory or in code is insecure. Use env variables or a secret manager.
    secure: true, // Default to true (TLS)
    fromEmail: '',
  },
};

export async function GET() {
  // Publicly readable, but sensitive parts like SMTP password should ideally be restricted
  // For this demo, we return all settings.
  // In a real app, you might have separate endpoints or logic to protect sensitive SMTP details.
  return NextResponse.json(appSettings);
}

export async function POST(request: NextRequest) {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const updatedSettings = await request.json() as Partial<AppSettings>; // Allow partial updates
    console.log('Received app settings update:', updatedSettings);

    // Merge existing settings with updates
    // Deep merge for socialLinks and smtpSettings individually
    if (updatedSettings.socialLinks) {
        appSettings.socialLinks = { ...appSettings.socialLinks, ...updatedSettings.socialLinks };
    }
    if (updatedSettings.smtpSettings) {
        appSettings.smtpSettings = { ...(appSettings.smtpSettings || {} as SmtpSettings), ...updatedSettings.smtpSettings };
         // Ensure port is a number
        if (appSettings.smtpSettings.port && typeof appSettings.smtpSettings.port === 'string') {
            appSettings.smtpSettings.port = parseInt(appSettings.smtpSettings.port, 10);
        }
    }


    // In a real application, you would save updatedSettings to your database/config store here
    console.log('Updated app settings:', appSettings);

    return NextResponse.json({ message: 'Application settings updated successfully', settings: appSettings });
  } catch (error) {
    console.error('Error updating application settings:', error);
    return NextResponse.json({ message: 'Failed to update application settings' }, { status: 500 });
  }
}
