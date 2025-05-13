// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { SocialLinks, SmtpSettings, AppSettings } from '@/lib/types';
import { Switch } from '@/components/ui/switch'; // For SMTP secure toggle

const AdminSettingsPage = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ linkedin: '', instagram: '', facebook: '' });
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    user: '',
    pass: '',
    secure: true,
    fromEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings'); // Updated API endpoint
        if (response.ok) {
          const data: AppSettings = await response.json();
          if (data.socialLinks) {
            setSocialLinks(data.socialLinks);
          }
          if (data.smtpSettings) {
            setSmtpSettings(data.smtpSettings);
          }
        } else {
          toast({
            title: 'Error fetching settings',
            description: 'Failed to load application settings.',
            variant: 'destructive',
          });
        }
      } catch (error) {
         toast({
            title: 'Error fetching settings',
            description: 'An unexpected error occurred while loading application settings.',
            variant: 'destructive',
          });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSocialInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prevLinks => ({ ...prevLinks, [name]: value }));
  };

  const handleSmtpInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSmtpSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : (name === 'port' ? (value === '' ? 0 : parseInt(value, 10)) : value),
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const settingsToSave: AppSettings = { socialLinks, smtpSettings };
      const response = await fetch('/api/settings', { // Updated API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Application settings updated successfully.',
        });
      } else {
         const errorData = await response.json().catch(() => ({}));
         toast({
            title: 'Error saving settings',
            description: errorData.message || 'Failed to save application settings.',
            variant: 'destructive',
          });
      }
    } catch (error) {
       toast({
          title: 'Error saving settings',
          description: 'An unexpected error occurred while saving application settings.',
          variant: 'destructive',
        });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Admin Settings</h1>
      <form onSubmit={handleSave} className="space-y-10">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Social Media Links</CardTitle>
            <CardDescription>Update your social media profile URLs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" name="linkedin" value={socialLinks.linkedin} onChange={handleSocialInputChange} />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" name="instagram" value={socialLinks.instagram} onChange={handleSocialInputChange} />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" name="facebook" value={socialLinks.facebook} onChange={handleSocialInputChange} />
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">SMTP Email Settings</CardTitle>
            <CardDescription>Configure settings for sending emails (e.g., contact form submissions).
                <br/><strong className="text-destructive">Warning: Handle SMTP password with extreme care.</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" name="host" value={smtpSettings.host} onChange={handleSmtpInputChange} />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" name="port" type="number" value={smtpSettings.port} onChange={handleSmtpInputChange} />
            </div>
            <div>
              <Label htmlFor="smtpUser">SMTP User</Label>
              <Input id="smtpUser" name="user" value={smtpSettings.user} onChange={handleSmtpInputChange} />
            </div>
            <div>
              <Label htmlFor="smtpPass">SMTP Password</Label>
              <Input id="smtpPass" name="pass" type="password" value={smtpSettings.pass} onChange={handleSmtpInputChange} placeholder="Enter password to update" />
               <p className="text-xs text-muted-foreground mt-1">Leave blank to keep existing password (if any).</p>
            </div>
             <div>
              <Label htmlFor="smtpFromEmail">From Email Address</Label>
              <Input id="smtpFromEmail" name="fromEmail" type="email" value={smtpSettings.fromEmail || ''} onChange={handleSmtpInputChange} placeholder="e.g., no-reply@yourdomain.com"/>
               <p className="text-xs text-muted-foreground mt-1">Email address that messages will be sent from.</p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="smtpSecure" name="secure" checked={smtpSettings.secure} onCheckedChange={(checked) => setSmtpSettings(prev => ({...prev, secure: checked}))} />
              <Label htmlFor="smtpSecure">Use SSL/TLS (Secure)</Label>
            </div>
          </CardContent>
        </Card>
        
        <div className="max-w-2xl mx-auto">
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground" disabled={saving}>
                {saving ? 'Saving Settings...' : 'Save All Settings'}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
