import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { paymentStore, reconciliationStore } from "@/lib/finance/store";
import { getSettlementReport } from "@/lib/finance/remitaSimulator";
import type { ReconciliationRecord } from "@/lib/types";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can run reconciliation" }, { status: 403 });
  }

  const settlements = getSettlementReport();
  const alreadyReconciled = new Set(reconciliationStore.map((r) => r.paymentId));
  const newRecords: ReconciliationRecord[] = [];

  for (const payment of paymentStore.filter((p) => p.status === "confirmed" && !alreadyReconciled.has(p.id))) {
    const settlement = settlements.find((s) => s.rrr === payment.rrr);
    const record: ReconciliationRecord = {
      id: `REC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5)}`,
      paymentId: payment.id,
      remitaSettlementRef: settlement?.remitaTransactionRef ?? "NOT FOUND IN SETTLEMENT REPORT",
      matched: !!settlement,
      reconciledAt: new Date().toISOString(),
    };
    reconciliationStore.push(record);
    newRecords.push(record);
  }

  return NextResponse.json({ processed: newRecords.length, records: newRecords });
}
