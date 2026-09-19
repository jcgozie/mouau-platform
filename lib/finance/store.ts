import type {
  FeeSchedule, StudentInvoice, Payment, ReconciliationRecord, Receipt,
  FinancialAdjustment, FinancialHold,
} from "../types";

export const feeSchedules: FeeSchedule[] = [
  { id: "FS-COA-UG", programmeSlug: "bsc-crop-science", session: "2026/2027", feeItems: [
    { name: "Tuition", amount: 45000 }, { name: "Registration", amount: 10000 }, { name: "ICT Levy", amount: 5000 },
  ]},
  { id: "FS-CVM-UG", programmeSlug: "dvm-veterinary-medicine", session: "2026/2027", feeItems: [
    { name: "Tuition", amount: 65000 }, { name: "Registration", amount: 10000 }, { name: "Clinical Fee", amount: 20000 },
  ]},
  { id: "FS-CMAS-PG", programmeSlug: "msc-agricultural-economics", session: "2026/2027", feeItems: [
    { name: "Tuition", amount: 90000 }, { name: "Registration", amount: 15000 },
  ]},
];

export const invoiceStore: StudentInvoice[] = [];
export const paymentStore: Payment[] = [];
export const reconciliationStore: ReconciliationRecord[] = [];
export const receiptStore: Receipt[] = [];
export const adjustmentStore: FinancialAdjustment[] = [];
export const financialHoldStore: FinancialHold[] = [];

export function invoicesFor(studentEmail: string): StudentInvoice[] {
  return invoiceStore.filter((i) => i.studentEmail.toLowerCase() === studentEmail.toLowerCase());
}

// Real computed balance — never a stored/cached number that can drift
// from the actual confirmed payments and approved adjustments behind it.
export function invoiceBalance(invoiceId: string): number {
  const invoice = invoiceStore.find((i) => i.id === invoiceId);
  if (!invoice) return 0;
  const paid = paymentStore
    .filter((p) => p.invoiceId === invoiceId && p.status === "confirmed")
    .reduce((sum, p) => sum + p.amount, 0);
  const adjustments = adjustmentStore
    .filter((a) => a.invoiceId === invoiceId && a.status === "approved")
    .reduce((sum, a) => sum + a.amount, 0);
  return Math.max(0, invoice.total - paid - adjustments);
}

export function studentOutstandingBalance(studentEmail: string): number {
  return invoicesFor(studentEmail).reduce((sum, inv) => sum + invoiceBalance(inv.id), 0);
}

export function activeHoldFor(studentEmail: string): FinancialHold | undefined {
  return financialHoldStore.find((h) => h.studentEmail.toLowerCase() === studentEmail.toLowerCase() && h.status === "active");
}
