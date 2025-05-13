// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Correct import from hooks

interface SocialLinks {
    linkedin: string;
    instagram: string;
    facebook: string;
}

const AdminSettingsPage = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ linkedin: '', instagram: '', facebook: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast() // Get toast function from the hook

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/settings/social');
        if (response.ok) {
          const data: SocialLinks = await response.json();
          setSocialLinks(data);
        } else {
          toast({
            title: 'Error fetching settings',
            description: 'Failed to load social media links.',
            variant: 'destructive',
          });
        }
      } catch (error) {
         toast({
            title: 'Error fetching settings',
            description: 'An unexpected error occurred while loading social media links.',
            variant: 'destructive',
          });
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prevLinks => ({ ...prevLinks, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLinks),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Social media links updated successfully.',
        });
      } else {
         toast({
            title: 'Error saving settings',
            description: 'Failed to save social media links.',
            variant: 'destructive',
          });
      }
    } catch (error) {
       toast({
          title: 'Error saving settings',
          description: 'An unexpected error occurred while saving social media links.',
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
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Update your social media profile URLs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" name="linkedin" value={socialLinks.linkedin} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input id="instagram" name="instagram" value={socialLinks.instagram} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input id="facebook" name="facebook" value={socialLinks.facebook} onChange={handleInputChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
