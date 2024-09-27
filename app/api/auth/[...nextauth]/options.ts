import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

const scopes = ['identify'].join(' ');

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Guest Login",
      credentials: {
        guestname: { label: "Guest Name", type: "text", placeholder: "Name" },
        guestpass: { label: "Guest Pass", type: "password", placeholder: "Guest Pass" },
      },
      async authorize(credentials) {
        const { guestname, guestpass } = credentials || {};
        if (guestname === "Guest" && guestpass === "Guest") {
          return { id: "Guest", role: "guest", name: "Guest", email: "Guest@ihyd.xyz", image: "https://drexel.edu/~/media/Drexel/Core-Site-Group/Core/Images/admissions/UG-blog/headshots/placeholder.jpg" }; // Include role in the user object
        }
        return null;
      }
    }),
    
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: scopes } },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.role === "guest") {
        session.user.id = "1256004244675493988"; // Use a fixed ID for guests
        session.user.name = "Guest";
        session.user.email = "Guest@ihyd.xyz";
        session.user.image = "https://drexel.edu/~/media/Drexel/Core-Site-Group/Core/Images/admissions/UG-blog/headshots/placeholder.jpg";
      } else if (token && token.sub) {
        session.user.id = token.sub || "";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  
  secret: process.env.NEXTAUTH_SECRET
};
