import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { serviceRequestStore, mockDirectorates } from "@/lib/directoratesData";
import type { ServiceRequest } from "@/lib/types";

/**
 * Human escalation — reuses Stage 6's real service-request ticket
 * system rather than inventing a second escalation mechanism. Always
 * available, not a fallback that only appears after the assistant
 * fails repeatedly.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { query, directorateSlug, requesterName, requesterEmail } = await request.json();

  const slug = directorateSlug ?? "ict";
  const directorate = mockDirectorates.find((d) => d.slug === slug);
  if (!directorate) return NextResponse.json({ error: "Unknown directorate" }, { status: 400 });

  const name = session?.user.name ?? requesterName;
  const email = session?.user.email ?? requesterEmail;
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required to escalate" }, { status: 400 });
  }

  const ticket: ServiceRequest = {
    id: `SR-${Date.now().toString(36).toUpperCase()}`,
    directorateSlug: slug,
    serviceName: directorate.services[0]?.name ?? "General enquiry",
    requesterName: name,
    requesterEmail: email,
    description: `Escalated from the AI assistant. Original question: "${query}"`,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };
  serviceRequestStore.push(ticket);

  return NextResponse.json({ ticket, trackAt: `/directorates/requests/status?id=${ticket.id}` }, { status: 201 });
}
