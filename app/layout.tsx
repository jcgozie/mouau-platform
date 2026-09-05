import type { Metadata } from "next";
import "./globals.css";
import EmergencyBanner from "@/components/EmergencyBanner";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "MOUAU | Michael Okpara University of Agriculture, Umudike",
  description:
    "MOUAU is Nigeria's leading specialist university of agriculture — teaching, research and rural-development impact across five colleges in Umudike, Abia State.",
  metadataBase: new URL("https://www.mouau.edu.ng"),
  openGraph: {
    title: "MOUAU | Michael Okpara University of Agriculture, Umudike",
    description:
      "Nigeria's leading specialist university of agriculture — teaching, research and rural-development impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: "Michael Okpara University of Agriculture, Umudike",
    alternateName: "MOUAU",
    url: "https://www.mouau.edu.ng",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Umudike",
      addressRegion: "Abia State",
      addressCountry: "NG",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <EmergencyBanner />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-forest focus:text-paper focus:px-4 focus:py-2 focus:rounded"
          >
            Skip to main content
          </a>
          {children}
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
