import crypto from "crypto";

/**
 * SIMULATED REMITA GATEWAY
 * ----------------------------------------------------------------
 * This sandbox has no network access to Remita's real API, so this
 * module stands in for it — generating RRRs and tracking their paid
 * state exactly the way Remita's real API would report them via a
 * transaction-status check. The application code that CALLS this
 * (app/api/finance/*) is written exactly as it would be against the
 * real Remita API: it generates an RRR server-side, never trusts a
 * client-side "payment successful" redirect, and always confirms by
 * querying transaction status server-side before marking anything paid.
 * Swapping this module for a real Remita SDK call is the only change
 * a production deployment needs.
 */

interface SimulatedRRR {
  rrr: string;
  amount: number;
  paid: boolean;
  remitaTransactionRef?: string;
}

const rrrLedger = new Map<string, SimulatedRRR>();

export function generateRRR(amount: number): string {
  const rrr = crypto.randomInt(100000000000, 999999999999).toString();
  rrrLedger.set(rrr, { rrr, amount, paid: false });
  return rrr;
}

// Simulates the payer completing payment on Remita's hosted page.
export function simulatePayerCompletesPayment(rrr: string): boolean {
  const entry = rrrLedger.get(rrr);
  if (!entry) return false;
  entry.paid = true;
  entry.remitaTransactionRef = `RMT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  return true;
}

// This is the function that matters: the real transaction-status check
// the application queries server-side. An RRR that was never actually
// paid on the (simulated) gateway returns paid: false, full stop — no
// client-supplied parameter can make this return true.
export function checkTransactionStatus(rrr: string): { found: boolean; paid: boolean; remitaTransactionRef?: string } {
  const entry = rrrLedger.get(rrr);
  if (!entry) return { found: false, paid: false };
  return { found: true, paid: entry.paid, remitaTransactionRef: entry.remitaTransactionRef };
}

// Simulates Remita's settlement report, used by reconciliation.
export function getSettlementReport(): { rrr: string; remitaTransactionRef: string; amount: number }[] {
  return Array.from(rrrLedger.values())
    .filter((e) => e.paid && e.remitaTransactionRef)
    .map((e) => ({ rrr: e.rrr, remitaTransactionRef: e.remitaTransactionRef!, amount: e.amount }));
}
