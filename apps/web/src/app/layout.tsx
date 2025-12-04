import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollIndicator } from "@/components/micro/scroll-indicator";
import { FluidCursor } from "@/components/micro/fluid-cursor";
import { NeuralBg } from "@/components/backgrounds/neural-bg";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.svg`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@romanmakes",
    images: [`${siteConfig.url}/og.svg`],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Principal Design Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Independent Studio",
  },
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.twitter],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground antialiased",
          inter.variable,
          spaceGrotesk.variable,
          jetBrains.variable,
        )}
      >
        <ThemeProvider>
          <ScrollIndicator />
          <FluidCursor className="hidden md:block" />
          <NeuralBg className="opacity-90" />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <div className="noise-layer" aria-hidden />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navigation />
            <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
