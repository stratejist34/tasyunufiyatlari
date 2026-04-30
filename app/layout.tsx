import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundaryWrapper } from "@/components/shared/ErrorBoundaryWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tasyunufiyatlari.com"),
  applicationName: "Taşyünü Fiyatları",
  title: {
    default: "Taşyünü Fiyatları — Mantolama Maliyeti Hesaplama",
    template: "%s | Taşyünü Fiyatları",
  },
  description:
    "Türkiye geneli taşyünü ve EPS fiyatları. Lojistik dahil mantolama maliyetinizi hesaplayın.",
  openGraph: {
    siteName: "Taşyünü Fiyatları",
    type: "website",
    locale: "tr_TR",
    url: "https://tasyunufiyatlari.com",
    title: "Taşyünü Fiyatları — Mantolama Maliyeti Hesaplama",
    description:
      "Türkiye geneli taşyünü ve EPS fiyatları. Lojistik dahil mantolama maliyetinizi hesaplayın.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taşyünü Fiyatları — Mantolama Maliyeti Hesaplama",
    description:
      "Türkiye geneli taşyünü ve EPS fiyatları. Lojistik dahil mantolama maliyetinizi hesaplayın.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} antialiased`}
      >
        <ErrorBoundaryWrapper>
          <Providers>{children}</Providers>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
