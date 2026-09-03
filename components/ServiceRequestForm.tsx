"use client";

import { useState } from "react";
import type { Directorate } from "@/lib/types";

export default function ServiceRequestForm({
  directorate,
  initialService,
}: {
  directorate: Directorate;
  initialService: string;
}) {
  const [service, setService] = useState(initialService || directorate.services[0]?.name || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [ticketId, setTicketId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directorateSlug: directorate.slug,
          serviceName: service,
          requesterName: name,
          requesterEmail: email,
          description,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const ticket = await res.json();
      setTicketId(ticket.id);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" && ticketId) {
    return (
      <div className="rounded-sm border border-forest/30 bg-sage-dim px-6 py-8">
        <p className="font-display text-xl text-forest">Request submitted</p>
        <p className="mt-2 text-ink/75">
          Your tracking number is <span className="font-mono font-medium text-ink">{ticketId}</span>.
          Save this to check your request status.
        </p>
        <a
          href={`/directorates/requests/status?id=${ticketId}`}
          className="mt-4 inline-block text-sm font-medium text-forest hover:text-gold-dark"
        >
          Check status now &rarr;
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-medium text-ink/70">Service</label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm"
        >
          {directorate.services.map((s) => (
            <option key={s.name} value={s.name}>{s.name} ({s.slaDays}-day SLA)</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink/70">Your name</label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/70">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink/70">Describe your request</label>
        <textarea id="description" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-700">Something went wrong submitting your request. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-sm bg-forest px-6 py-3 text-sm font-medium text-paper transition-colors duration-400 hover:bg-forest-light disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
