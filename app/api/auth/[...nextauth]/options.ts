import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const scopes = ['identify'].join(' ');

export const options: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: scopes } },
    }),
  ],
  callbacks: {
    async session({session, token, user, }) {
      if (token) {
        if (token?.picture?.includes("discord")) {
          session.user.id = token.sub || "";
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
