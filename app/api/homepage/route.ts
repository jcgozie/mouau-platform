import { NextResponse } from "next/server";
import { mockHomepageData } from "@/lib/mockData";

// Stands in for the real CMS API (Strapi/Payload) referenced in
// lib/cms.ts. Replace this handler's body with a proxy to the live
// CMS when it's connected — the response shape (HomepageData) must
// stay identical so the frontend requires no changes.
export async function GET() {
  return NextResponse.json(mockHomepageData);
}
