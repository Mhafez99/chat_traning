import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      userData: {
        Email: string;
        Username: string;
      };
    };
  }
}
