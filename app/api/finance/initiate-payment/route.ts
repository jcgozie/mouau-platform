import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { invoiceStore, paymentStore, invoiceBalance } from "@/lib/finance/store";
import { generateRRR } from "@/lib/finance/remitaSimulator";
import type { Payment, PayerType } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { invoiceId } = await request.json();
  const invoice = invoiceStore.find((i) => i.id === invoiceId);
  if (!invoice) return NextResponse.json({ error: "Unknown invoice" }, { status: 400 });

  const balance = invoiceBalance(invoiceId);
  if (balance <= 0) return NextResponse.json({ error: "This invoice has no outstanding balance" }, { status: 409 });

  const payerType: PayerType = session.user.roles.includes("Sponsor")
    ? "Sponsor"
    : session.user.roles.includes("Alumni")
    ? "Alumni"
    : "Student";

  // The one thing that actually matters in this route: the RRR is
  // generated server-side, before the payer ever sees a payment page —
  // never client-supplied, never trusted from a redirect parameter.
  const rrr = generateRRR(balance);

  const payment: Payment = {
    id: `PMT-${Date.now().toString(36).toUpperCase()}`,
    payerEmail: session.user.email!,
    payerType,
    invoiceId,
    amount: balance,
    rrr,
    status: "rrr_generated",
    initiatedAt: new Date().toISOString(),
  };
  paymentStore.push(payment);

  return NextResponse.json(payment, { status: 201 });
}
