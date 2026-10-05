import React, { createContext, useContext } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { openSignIn, signOut } = useClerk();
  const { getToken } = useClerkAuth();

  // Derive email & name directly from Clerk — no localStorage fallback needed
  const currentUserEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';
  const currentUserName =
    clerkUser?.fullName ||
    clerkUser?.firstName ||
    currentUserEmail.split('@')[0] ||
    '';

  /**
   * isTCETStudent is derived on the frontend ONLY from the Clerk user object.
   * The real security check still happens server-side.
   * We only apply the TCET domain check when the user signed in via Google OAuth
   * (externalAccounts contains a google entry).
   */
  const signedInWithGoogle = clerkUser?.externalAccounts?.some(
    (a) => a.provider === 'google' || a.provider === 'oauth_google'
  ) ?? false;

  const isTCETStudent = signedInWithGoogle
    ? currentUserEmail.toLowerCase().trim().endsWith('@tcetmumbai.in')
    : false; // Manual sign-in → no TCET restriction check on frontend

  const loginWithClerk = () => {
    if (openSignIn) openSignIn();
  };

  const logout = () => {
    if (signOut) signOut();
  };

  /**
   * Returns a fresh Clerk session JWT to attach to backend requests.
   * Usage: const token = await getClerkToken();
   */
  const getClerkToken = async () => {
    try {
      return await getToken();
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      clerkUser,
      isLoaded: clerkLoaded,
      isSignedIn: isSignedIn ?? false,
      currentUserEmail,
      currentUserName,
      isTCETStudent,
      signedInWithGoogle,
      loginWithClerk,
      logout,
      getClerkToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
