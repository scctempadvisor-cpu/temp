import type { Metadata, Viewport } from "next";
import {
  Barlow_Condensed,
  IBM_Plex_Mono,
  Montserrat,
  Rajdhani,
} from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SITE } from "@/lib/site";
import ClientBody from "./ClientBody";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* Static (non-variable) cuts: no overlapping contours on outlined/stroked type */
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Construction",
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/llms.txt" },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 619,
        alt: "Steel Commander Corp pre-engineered steel building",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SCommanderCorp",
    creator: "@SCommanderCorp",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: [{ url: "/scc/shield.png", type: "image/png", sizes: "270x270" }],
    apple: [{ url: "/scc/shield.png", sizes: "270x270" }],
  },
  formatDetection: { telephone: true, address: true, email: false },
  other: {
    "geo.region": "US-FL",
    "geo.placename": "Boca Raton",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d1b" },
  ],
};

/* Without JavaScript: drop the loader and show every reveal / plotted drawing */
const NOSCRIPT_CSS = `<style>
html.is-loading{overflow:auto!important}
#site-loader{display:none!important}
.fu,.rise{opacity:1!important;transform:none!important;animation:none!important}
.iso-l{opacity:1!important;transform:translateY(var(--base))!important}
.rv-word>span,.rule-x,.rule-y{transform:none!important}
[data-plot]{opacity:1!important}
</style>`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      dir="ltr"
      suppressHydrationWarning
      className={`is-loading ${montserrat.variable} ${barlow.variable} ${rajdhani.variable} ${plexMono.variable}`}
    >
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-grab/dist/index.global.js"
        />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
