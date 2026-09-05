import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import type { Role } from "@/lib/types";

const PORTAL_PATH: Partial<Record<Role, string>> = {
  Applicant: "/portals/applicant",
  Student: "/portals/student",
  Sponsor: "/portals/sponsor",
  Staff: "/portals/staff",
  Researcher: "/portals/researcher",
  Alumni: "/portals/alumni",
  Partner: "/portals/partner",
  SystemAdministrator: "/portals/admin",
};

export default async function PortalsIndexPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/portals");
  }

  const roles = session!.user.roles;
  const portalRoles = roles.filter((r) => PORTAL_PATH[r]);

  if (portalRoles.length === 1) {
    redirect(PORTAL_PATH[portalRoles[0]]!);
  }

  // More than one portal-eligible role (e.g. Staff + Researcher) — let
  // the person choose, rather than guessing which one they meant.
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Portals" title="Choose a portal" lede="Your account holds more than one role." />
        <section>
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <ul>
              {portalRoles.map((r) => (
                <li key={r} className="border-t border-sage py-4 last:border-b">
                  <a href={PORTAL_PATH[r]} className="font-display text-lg text-forest hover:text-gold-dark">
                    {r} Portal &rarr;
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
