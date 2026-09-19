import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { feeSchedules, invoiceStore, invoicesFor } from "@/lib/finance/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import type { StudentInvoice } from "@/lib/types";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can generate an invoice" }, { status: 403 });
  }

  const record = findStudentRecordByEmail(session.user.email!);
  if (!record) return NextResponse.json({ error: "No Student Master Record found" }, { status: 404 });

  const schedule = feeSchedules.find((s) => s.programmeSlug === record.programmeSlug && s.session === record.entrySession);
  if (!schedule) return NextResponse.json({ error: "No fee schedule on file for this programme/session" }, { status: 404 });

  if (invoicesFor(session.user.email!).some((i) => i.session === schedule.session)) {
    return NextResponse.json({ error: "Invoice already generated for this session" }, { status: 409 });
  }

  const total = schedule.feeItems.reduce((sum, f) => sum + f.amount, 0);
  const invoice: StudentInvoice = {
    id: `INV-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    session: schedule.session,
    feeItems: schedule.feeItems,
    total,
    dueDate: "2026-12-01",
    status: "billed",
  };
  invoiceStore.push(invoice);

  return NextResponse.json(invoice, { status: 201 });
}
