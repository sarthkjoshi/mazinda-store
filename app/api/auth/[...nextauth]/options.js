import connectDB from "@/libs/mongoose";
import Store from "@/models/Store";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";

export const authOptions = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const store = await Store.findOne({
          mobileNumber: credentials.phone,
        });
        if (store) {
          if (store.password === credentials.password) {
            return store;
          } else {
            throw new Error("Password dont match");
          }
        } else {
          throw new Error("Store not found");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          storeName: user.storeName,
          mobileNumber: user.mobileNumber,
          email: user.email,
          approvedStatus: user.approvedStatus,
          businessType: user.businessType,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          storeName: token.storeName,
          mobileNumber: token.mobileNumber,
          email: token.email,
          approvedStatus: token.approvedStatus,
          businessType: token.businessType,
        },
      };
      // return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    stategy: "jwt",
  },
};
