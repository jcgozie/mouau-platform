import { NextResponse } from "next/server";
import { simulatePayerCompletesPayment } from "@/lib/finance/remitaSimulator";

// This route stands in for Remita's own hosted payment page — in a
// real deployment, this entire route doesn't exist; the payer is
// redirected to remita.net and Remita calls it, not us. It exists here
// only because this sandbox can't reach the real gateway.
export async function POST(request: Request) {
  const { rrr } = await request.json();
  const ok = simulatePayerCompletesPayment(rrr);
  if (!ok) return NextResponse.json({ error: "Unknown RRR" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
