"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const RAW_ID = process.env.NEXT_PUBLIC_GA4_ID;
const ID = RAW_ID && /^G-[A-Z0-9]+$/.test(RAW_ID) ? RAW_ID : undefined;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!ID || !window.gtag) return;
    if (first.current) {
      first.current = false;
      return;
    }
    window.gtag("config", ID, { page_path: pathname });
  }, [pathname]);

  if (!ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ID}');
      `}</Script>
    </>
  );
}
