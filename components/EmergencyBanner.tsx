"use client";

import { useState } from "react";
import { emergencyBannerConfig } from "@/lib/newsData";

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!emergencyBannerConfig.isActive || dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-gold px-5 py-3 text-sm text-ink md:px-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p>
          <span className="font-medium">Notice:</span> {emergencyBannerConfig.message}{" "}
          {emergencyBannerConfig.linkHref && (
            <a href={emergencyBannerConfig.linkHref} className="underline hover:no-underline">
              {emergencyBannerConfig.linkLabel ?? "Learn more"}
            </a>
          )}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="shrink-0 rounded-sm border border-ink/30 px-2 py-1 text-xs hover:bg-ink/10"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
