// src/app/api/settings/route.ts
import { NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings as saveAppSettingsData } from '@/app/api/settings/settings-data';
import { isAdminSession } from '@/lib/auth-utils';
import type { AppSettings } from '@/lib/types';
import { z } from 'zod';

// Zod schema for validating incoming settings data on POST
const socialLinksSchema = z.object({
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal('')).optional(),
  instagram: z.string().url("Invalid Instagram URL").or(z.literal('')).optional(),
  facebook: z.string().url("Invalid Facebook URL").or(z.literal('')).optional(),
}).partial(); // Use partial as not all fields might be sent

const smtpSettingsSchema = z.object({
  host: z.string().optional(), // Host can be empty if clearing settings
  port: z.coerce.number().int().positive("Port must be a positive integer.").optional(),
  user: z.string().optional(),
  pass: z.string().optional(), // Password can be empty (to signify no change or clearing)
  secure: z.boolean().optional(),
  fromEmail: z.string().email("Invalid 'From Email' address.").or(z.literal('')).optional(),
}).partial();

const appSettingsPostSchema = z.object({
  socialLinks: socialLinksSchema.optional(),
  smtpSettings: smtpSettingsSchema.optional(),
});

/**
 * GET /api/settings
 * Retrieves the current application settings.
 */
export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[API Settings GET] Error fetching settings:', error);
    return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 });
  }
}

/**
 * POST /api/settings
 * Updates the application settings. Requires admin privileges.
 */
export async function POST(request: Request) {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedRequest = appSettingsPostSchema.safeParse(body);

    if (!validatedRequest.success) {
      return NextResponse.json({ 
        message: 'Invalid settings data provided.', 
        errors: validatedRequest.error.flatten().fieldErrors 
      }, { status: 400 });
    }
    
    const newSettingsData: Partial<AppSettings> = {};
    if(validatedRequest.data.socialLinks) {
        newSettingsData.socialLinks = validatedRequest.data.socialLinks;
    }
    if(validatedRequest.data.smtpSettings) {
        newSettingsData.smtpSettings = validatedRequest.data.smtpSettings;
    }

    const savedSettings = await saveAppSettingsData(newSettingsData);
    return NextResponse.json(savedSettings);

  } catch (error: any) {
    console.error('[API Settings POST] Error saving settings:', error);
    // Ensure a generic message for unexpected errors
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while saving settings.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
