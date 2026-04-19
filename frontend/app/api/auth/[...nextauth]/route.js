import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || 'dev_secret_change_me',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" } // 'login' or 'register'
      },
      async authorize(credentials, req) {
        const { email, password, action } = credentials;
        
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        try {
          if (action === 'register') {
            // Simple registration hitting backend /auth/register
            const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password, name: email.split('@')[0] }),
            });

            if (!registerResponse.ok) {
              const error = await registerResponse.json();
              throw new Error(error.message || 'Registration failed');
            }

            const userData = await registerResponse.json();
            return {
              id: userData.user.id,
              name: userData.user.name,
              email: userData.user.email,
              role: userData.user.role,
              accessToken: userData.access_token,
            };
          } else {
            // Login flow
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
              const error = await loginResponse.json();
              throw new Error(error.message || 'Login failed');
            }

            const userData = await loginResponse.json();
            return {
              id: userData.user.id,
              name: userData.user.name,
              email: userData.user.email,
              role: userData.user.role,
              accessToken: userData.access_token,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub || token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Keep default redirect; client/middleware handle role-based route
      return url.startsWith(baseUrl) ? baseUrl : url;
    },
  },
});

export { handler as GET, handler as POST };
