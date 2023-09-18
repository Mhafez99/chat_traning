'use client';
import { useSession } from 'next-auth/react';

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    if (!session || !session.user || !session.user.refreshToken) {
      console.error('Session or refreshToken not available.');
      return;
    }
    try {
      console.log('Hafez');

      const res = await fetch('/api/refreshToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session?.user.refreshToken),
      });

      console.log(res);

      if (!res.ok) {
        console.error('Token refresh request failed.');
        return;
      }

      const data = await res.json();

      console.log(data);

      if (session) session.user.accessToken = data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  const isAccessTokenExpired = () => {
    const expirationTime = session?.user.accessExpiryDate;

    const currentTime = Math.floor(Date.now());

    return currentTime > expirationTime!;
  };
  return {
    refreshToken,
    isAccessTokenExpired,
  };
};
