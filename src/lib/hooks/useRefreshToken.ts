'use client';
import { useSession } from 'next-auth/react';

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    if (!session || !session.user || !session.user.refreshToken) {
      console.error('Session or refreshToken not available.');
      return;
    }
    if (isAccessTokenExpired(session.user.accessToken)) {
      try {
        const res = await fetch('/api/refreshToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(session.user.refreshToken),
        });
        if (!res.ok) {
          console.error('Token refresh request failed.');
          return;
        }

        const data = await res.json();

        console.log('new accessToken', data.accessToken);

        if (session) session.user.accessToken = data.accessToken;
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  };
  const isAccessTokenExpired = (accessToken: string) => {
    const expirationTime = session?.user.accessExpiryDate; // Replace with the actual expiration time you receive from the server
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= expirationTime!;
  };
  return {
    refreshToken,
    isAccessTokenExpired,
  };
};
