"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const ID = process.env.NEXT_PUBLIC_YM_ID;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...rest: unknown[]) => void;
  }
}

export function YandexMetrika() {
  const pathname = usePathname();
  const first = useRef(true);

  // App Router переходит по клиенту — Метрика сама их не видит, шлём hit руками.
  useEffect(() => {
    if (!ID) return;
    if (first.current) {
      first.current = false; // первый хит уже отправил init
      return;
    }
    window.ym?.(Number(ID), "hit", window.location.href);
  }, [pathname]);

  if (!ID) return null; // ponytail: нет id — нет тега, локальная разработка не мусорит в счётчик

  return (
    <Script id="ym" strategy="afterInteractive">{`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${ID}','ym');
ym(${ID},'init',{webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});
    `}</Script>
  );
}
