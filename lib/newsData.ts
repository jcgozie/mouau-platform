import type { EventItem, EmergencyBannerConfig } from "./types";

export const mockEvents: EventItem[] = [
  {
    id: "e1",
    slug: "matriculation-2026",
    title: "2026/2027 Matriculation Ceremony",
    dateTime: "2026-10-14T09:00:00",
    venue: "MOUAU Main Auditorium",
    organizer: "Registry",
    audience: "Public",
    registrationUrl: "/study/admissions",
    description: "The formal matriculation ceremony for newly admitted students across all five colleges.",
  },
  {
    id: "e2",
    slug: "agric-innovation-week-2026",
    title: "Agricultural Innovation Week",
    dateTime: "2026-09-22T10:00:00",
    venue: "College of Agriculture Grounds",
    organizer: "Research, Innovation & Development",
    audience: "Public",
    livestreamUrl: "https://example.com/live/innovation-week",
    description: "A week of exhibitions, farmer field days, and research showcases across MOUAU's colleges and centres.",
  },
  {
    id: "e3",
    slug: "senate-academic-briefing",
    title: "Senate Academic Session Briefing",
    dateTime: "2026-07-10T14:00:00",
    venue: "Senate Chambers",
    organizer: "Academic Planning",
    audience: "Staff",
    description: "Briefing for academic staff ahead of the new session's Senate approval cycle.",
  },
];

export const emergencyBannerConfig: EmergencyBannerConfig = {
  // Off by default — this is real, working infrastructure, not a demo
  // left permanently on. Flip isActive true (or wire to a CMS field)
  // when an actual notice needs site-wide visibility.
  isActive: false,
  message: "Campus water supply maintenance scheduled for Saturday — some buildings affected.",
  linkHref: "/news/campus-maintenance-notice",
  linkLabel: "Details",
};
