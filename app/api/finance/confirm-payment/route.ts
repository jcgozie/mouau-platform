import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { paymentStore, receiptStore } from "@/lib/finance/store";
import { checkTransactionStatus } from "@/lib/finance/remitaSimulator";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { Receipt } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { paymentId } = await request.json();
  const payment = paymentStore.find((p) => p.id === paymentId);
  if (!payment) return NextResponse.json({ error: "Unknown payment" }, { status: 404 });
  if (payment.status === "confirmed") {
    return NextResponse.json(payment);
  }

  // THE non-negotiable of this entire stage: confirmation comes ONLY
  // from querying the (simulated) Remita transaction-status API against
  // this payment's own RRR — never from anything the client sends in
  // this request body. There is no "confirmed: true" field anywhere in
  // this request that this code even looks at.
  const status = checkTransactionStatus(payment.rrr);

  if (!status.found || !status.paid) {
    logAuditEvent("payment_confirmation_failed", session.user.email!, `RRR ${payment.rrr} not yet paid per gateway status check`);
    return NextResponse.json({ error: "Payment not yet confirmed by the gateway", status: "unpaid" }, { status: 409 });
  }

  payment.status = "confirmed";
  payment.confirmedAt = new Date().toISOString();
  payment.remitaTransactionRef = status.remitaTransactionRef;

  const receipt: Receipt = {
    id: `RCT-${Date.now().toString(36).toUpperCase()}`,
    paymentId: payment.id,
    receiptNumber: `MOUAU-${new Date().getFullYear()}-${String(receiptStore.length + 1).padStart(5, "0")}`,
    issuedAt: new Date().toISOString(),
  };
  receiptStore.push(receipt);

  logAuditEvent("payment_confirmed", session.user.email!, `Confirmed ${payment.amount} via RRR ${payment.rrr}`);

  return NextResponse.json({ payment, receipt });
}
