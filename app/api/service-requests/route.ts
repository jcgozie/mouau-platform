import { NextResponse } from "next/server";
import { serviceRequestStore } from "@/lib/directoratesData";
import type { ServiceRequest } from "@/lib/types";

// In-memory store — real and functional within a server process, but
// resets on redeploy/restart. Production needs this backed by Postgres
// (see db/schema.sql for the pattern already established in Stage 1);
// documented here rather than silently pretending this persists.

export async function POST(request: Request) {
  const body = await request.json();
  const { directorateSlug, serviceName, requesterName, requesterEmail, description } = body;

  if (!directorateSlug || !serviceName || !requesterName || !requesterEmail || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ticket: ServiceRequest = {
    id: `SR-${Date.now().toString(36).toUpperCase()}`,
    directorateSlug,
    serviceName,
    requesterName,
    requesterEmail,
    description,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  serviceRequestStore.push(ticket);
  return NextResponse.json(ticket, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }
  const ticket = serviceRequestStore.find((t) => t.id === id);
  if (!ticket) {
    return NextResponse.json({ error: "No ticket found with that ID" }, { status: 404 });
  }
  return NextResponse.json(ticket);
}
