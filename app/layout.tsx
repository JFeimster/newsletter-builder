import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const canonical = "https://newsletter-builder.feimster.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(canonical),
  title: "Newsletter Builder — Build, Design & Launch Your Publication",
  description: "Turn a newsletter idea into a positioned publication, design system, platform architecture, launch plan, welcome sequence, sponsor kit, and first 12 issues.",
  alternates: { canonical },
  applicationName: "Newsletter Builder",
  category: "Business",
  keywords: ["newsletter builder","publication strategy","editorial calendar","newsletter launch plan","newsletter design system"],
  openGraph: {
    type: "website",
    url: canonical,
    siteName: "Newsletter Builder",
    title: "Newsletter Builder — Build, Design & Launch Your Publication",
    description: "Name it. Position it. Design it. Build the first 12 issues, welcome sequence, referral program, sponsor package, and landing page.",
    images: [{ url: "/social-preview.svg", width: 1200, height: 630, alt: "Newsletter Builder editorial command center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter Builder — Build, Design & Launch Your Publication",
    description: "Build a publication people actually open—and an operating system that survives launch week.",
    images: ["/social-preview.svg"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Newsletter Builder",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: canonical,
  description: "An interactive publication strategy, design, editorial planning, platform architecture, and launch-package builder.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }} />
      </body>
    </html>
  );
}
