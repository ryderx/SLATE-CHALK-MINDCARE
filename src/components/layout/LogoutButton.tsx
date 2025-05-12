
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extend ButtonProps to accept variant, size etc.
interface LogoutButtonProps extends ButtonProps {}

export function LogoutButton(props: LogoutButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }

      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });

      // Redirect to homepage and refresh to update state
      router.push('/');
      router.refresh();

    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine default props if not provided
   const { variant = "ghost", size = "default", className, children, ...rest } = props;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
      {...rest} // Pass any remaining ButtonProps
    >
       {/* Provide default content if children aren't passed */}
      {children || (
          <>
              <LogOut className={size !== 'icon' ? "mr-2 h-4 w-4" : "h-4 w-4"} />
              {size !== 'icon' && (isLoading ? 'Logging out...' : 'Logout')}
              {size === 'icon' && <span className="sr-only">Logout</span>}
          </>
       )}
    </Button>
  );
}
