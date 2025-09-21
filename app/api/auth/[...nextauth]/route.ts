// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';
const db = require('../../../../lib/db');

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
      // ✅ ESTA ES LA LÓGICA DE AUTENTICACIÓN SEGURA
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // 1. Buscar al usuario en la base de datos por su email
        const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [credentials.email]);
        const user = rows[0];

        if (!user) {
          // Si no se encuentra el usuario, retornamos null
          return null;
        }

        // 2. Comparar la contraseña enviada con el hash guardado
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (passwordsMatch) {
          // 3. Si las contraseñas coinciden, retornamos el objeto de usuario
          // (sin la contraseña, por seguridad)
          return { id: user.id, name: user.nombre, email: user.email };
        } else {
          // Si no coinciden, retornamos null
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: { /* ... (tus callbacks se mantienen igual) ... */ },
  // ... (puedes añadir una página de error personalizada aquí si quieres)
});

export { handler as GET, handler as POST };