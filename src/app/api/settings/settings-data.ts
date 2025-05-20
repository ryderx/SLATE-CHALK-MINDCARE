// src/app/api/settings/settings-data.ts
import type { AppSettings } from '@/lib/types';

// Default initial settings
let currentSettings: AppSettings = {
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/example',
    instagram: 'https://www.instagram.com/example',
    facebook: 'https://www.facebook.com/example',
  },
  smtpSettings: {
    host: '',
    port: 587, // Default SMTP port
    user: '',
    pass: '', // IMPORTANT: Store securely in a real app; empty for initial state
    secure: true, // Use TLS by default
    fromEmail: 'noreply@example.com',
  },
};

/**
 * Retrieves the current application settings.
 * @returns A promise that resolves to the AppSettings.
 */
export async function getAppSettings(): Promise<AppSettings> {
  // In a real application, this would fetch from a database or a persistent configuration file.
  // Returning a deep copy to prevent direct modification of the in-memory store.
  return JSON.parse(JSON.stringify(currentSettings));
}

/**
 * Updates the application settings.
 * @param newSettings - The new settings to apply.
 * @returns A promise that resolves to the updated AppSettings.
 */
export async function updateAppSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
  // In a real application, this would save to a database or a persistent configuration file.

  if (newSettings.socialLinks) {
    currentSettings.socialLinks = {
      ...currentSettings.socialLinks,
      ...newSettings.socialLinks,
    };
  }

  if (newSettings.smtpSettings) {
    const incomingSmtp = newSettings.smtpSettings;
    // Ensure currentSettings.smtpSettings exists before trying to spread it
    if (!currentSettings.smtpSettings) {
        currentSettings.smtpSettings = { host: '', port: 587, user: '', pass: '', secure: true, fromEmail: ''};
    }

    // Preserve existing password if the incoming password is an empty string (meaning "don't change")
    const preservedPass = (incomingSmtp.pass === '' && currentSettings.smtpSettings.pass)
      ? currentSettings.smtpSettings.pass
      : incomingSmtp.pass;

    currentSettings.smtpSettings = {
      ...currentSettings.smtpSettings,
      ...incomingSmtp,
      pass: preservedPass, // Apply the potentially preserved password
    };
  }
  
  // Returning a deep copy.
  return JSON.parse(JSON.stringify(currentSettings));
}
