import type { Metadata } from "next";
import { Inter, Playfair_Display, Unbounded, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SunTheme } from "@/components/SunTheme";
import { CustomCursorLazy } from "@/components/CustomCursorLazy";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const serif = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["700", "800", "900"], variable: "--font-unbounded" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: "Сергей Рамас — Solutions, Projects, Ideas", template: "%s · Сергей Рамас" },
  description: "Сергей Рамас. AI-операционные системы, лендинги, автоматизация продаж. Упакованные решения и живые проекты.",
  metadataBase: new URL("https://sergeyramas.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Сергей Рамас",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${serif.variable} ${unbounded.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SunTheme />
          <CustomCursorLazy />
          <div className="grain" aria-hidden />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
