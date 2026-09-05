import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { authOptions } from "@/lib/auth/authOptions";
import { findUserByEmail } from "@/lib/auth/users";

// Step 1: generate a fresh secret (not yet saved to the account) and a
// scannable QR code. The secret is only persisted once verify-setup
// confirms the person actually has it in their authenticator app —
// otherwise an interrupted setup could silently "enable" MFA with a
// secret nobody actually captured, locking the account out.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const user = findUserByEmail(session.user.email!);
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, "MOUAU Digital University", secret);
  const qrDataUrl = await QRCode.toDataURL(otpauth);

  return NextResponse.json({ secret, qrDataUrl });
}
