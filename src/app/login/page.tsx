
// src/app/login/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log('[Login Page] Attempting login for:', email); // Client-side log

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('[Login Page] API Response Status:', response.status); // Log status
      console.log('[Login Page] API Response Data:', data); // Log response data

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      // Login successful
      console.log('[Login Page] Login successful via API:', data);
      // Redirect to homepage or admin dashboard after successful login
      // We might need to refresh the page or parts of it to reflect the logged-in state
      router.push('/'); // Redirect to home first
      // Wait briefly for navigation before refresh? Usually not needed, but can try if state isn't updating
      // await new Promise(resolve => setTimeout(resolve, 100));
      router.refresh(); // Force refresh of Server Components to pick up new cookie state
      console.log('[Login Page] Redirecting and refreshing...');

    } catch (err: any) {
      console.error('[Login Page] Login fetch/processing error:', err); // Log the actual error
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 md:py-20 flex justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access admin features.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Login'}
            </Button>
          </form>
           <p className="text-xs text-muted-foreground text-center mt-4">
              (Demo: admin@example.com / password)
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
