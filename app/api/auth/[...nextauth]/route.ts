"use server";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // forces account chooser every time
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
   callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("callbackUrl")) {
        return url;
      }
      return `${baseUrl}/planner`;
    },
    async session({ session }) {
      return session;
    },
  },
});


export { handler as GET, handler as POST };
