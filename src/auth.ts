import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface CustomUser {
  id: string;
  email: string;
  name: string;
  enterprise: string;
  emailVerified: null;
}

const config: NextAuthConfig = {
  theme: {
    logo: '/logo.svg',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        try {
          console.log('[AUTH] Attempting login with email:', credentials.email);
          
          const results = await query<{
            id: number;
            email: string;
            name: string;
            enterprise: string;
            password_hash: string;
          }>(
            'SELECT id, email, name, enterprise, password_hash FROM users WHERE email = $1',
            [credentials.email]
          );

          console.log('[AUTH] Query results count:', results.length);

          if (results.length === 0) {
            console.log('[AUTH] No user found with email:', credentials.email);
            return null;
          }

          const user = results[0];
          console.log('[AUTH] User found:', user.email, 'Enterprise:', user.enterprise);
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          console.log('[AUTH] Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('[AUTH] Password mismatch for user:', user.email);
            return null;
          }

          console.log('[AUTH] Login successful for:', user.email);
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            enterprise: user.enterprise,
            emailVerified: null,
          };
        } catch (error) {
          console.error('[AUTH] Error during login:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Para OAuth (Google), verificar ou criar usuário
      if (account?.provider === 'google' && user.email) {
        try {
          const results = await query<{
            id: number;
            enterprise: string;
          }>(
            'SELECT id, enterprise FROM users WHERE email = $1',
            [user.email]
          );

          // Se usuário não existe com Google, criar um (precisará definir enterprise depois)
          if (results.length === 0) {
            await query(
              `INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
               VALUES ($1, $2, $3, $4, NOW(), NOW())`,
              [user.email, user.name || '', '!oauth_google', 'pending']
            );
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return true; // Continuar mesmo se houver erro
        }
      }
      return true;
    },
    jwt({ token, user, account }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.email = customUser.email;
        token.name = customUser.name;
        token.enterprise = customUser.enterprise;
        token.provider = account?.provider || 'credentials';
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email || '',
          name: token.name || '',
          enterprise: token.enterprise as string,
          emailVerified: null,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export const { handlers, auth } = NextAuth(config);
