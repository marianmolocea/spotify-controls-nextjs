import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { refreshAccessToken } from 'spotify-web-api-node/src/server-methods';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshAccessToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    console.log('Refreshed token is: ', refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() - refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (err) {
    console.log(err);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: './login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access tocken has expire. A new token needs to be refreshed

      return await refreshAccessToken(token);
    },

  },
});