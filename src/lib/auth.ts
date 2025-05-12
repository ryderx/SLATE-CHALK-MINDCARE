'use server'; // Since it might be called from server components/actions

// Mock user data - replace with actual Firebase auth later
const MOCK_ADMIN_USER = { id: 'admin-user-123', email: 'admin@example.com', isAdmin: true };
const MOCK_NORMAL_USER = { id: 'normal-user-456', email: 'user@example.com', isAdmin: false };

// Simulate getting the current user. In a real app, this would interact with Firebase Auth.
export async function getCurrentUser(): Promise<{ id: string; email: string; isAdmin: boolean } | null> {
  // Simulate fetching user session
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async call
  
  // !!! IMPORTANT: Replace this logic with actual Firebase Auth check !!!
  // For now, let's pretend the admin is always logged in for demonstration.
  // Set this to MOCK_ADMIN_USER, MOCK_NORMAL_USER, or null to test different states.
  const currentUser = MOCK_ADMIN_USER; 
  
  return currentUser;
}

export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user?.isAdmin;
}
