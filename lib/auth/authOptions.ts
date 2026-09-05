import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { findUserByEmail } from "./users";
import { logAuditEvent } from "./auditLog";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 4 }, // 4h — shorter for financial/personal-data-adjacent portals per spec
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "MOUAU Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "Authenticator code", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const password = credentials?.password ?? "";
        const totpCode = credentials?.totpCode?.trim() ?? "";

        const user = findUserByEmail(email);
        if (!user) {
          logAuditEvent("login_failed", email, "No account with this email");
          throw new Error("Invalid email or password.");
        }

        const passwordOk = bcrypt.compareSync(password, user.passwordHash);
        if (!passwordOk) {
          logAuditEvent("login_failed", email, "Incorrect password");
          throw new Error("Invalid email or password.");
        }

        // Real MFA enforcement — this is not bypassable by omitting the
        // field, since it's checked server-side in authorize(), not
        // client-side before submit.
        if (user.mfaEnabled) {
          if (!totpCode) {
            logAuditEvent("mfa_challenge_failed", email, "MFA required, no code supplied");
            throw new Error("MFA_REQUIRED");
          }
          const codeOk = authenticator.check(totpCode, user.mfaSecret!);
          if (!codeOk) {
            logAuditEvent("mfa_challenge_failed", email, "Invalid authenticator code");
            throw new Error("Invalid authenticator code.");
          }
          logAuditEvent("mfa_challenge_passed", email, "TOTP verified");
        }

        logAuditEvent("login_success", email, `Roles: ${user.roles.join(", ")}`);

        return { id: user.id, name: user.name, email: user.email, roles: user.roles } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = (user as any).roles;
        token.uid = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).roles = token.roles;
        (session.user as any).id = token.uid;
      }
      return session;
    },
  },
};
