// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';
const db = require('@/lib/db');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const { rows } = await db.query(
          'SELECT id, nombre, email, password FROM usuarios WHERE email = $1', 
          [credentials.email]
        );
        const user = rows[0];

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (passwordsMatch) {
          return { id: user.id, name: user.nombre, email: user.email };
        }
        return null;
      }
    }),
  ],
  // pages: {
  //   signIn: '/auth/signin', // ✅ Asegúrate de que esta línea exista
  // },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: { /* ... (tus callbacks se mantienen igual) ... */ },
  // ... (puedes añadir una página de error personalizada aquí si quieres)
});

export { handler as GET, handler as POST };