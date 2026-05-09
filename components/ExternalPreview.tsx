"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface ExternalPreviewProps {
  url: string;
  /** Path under /public to a screenshot, e.g. /previews/foo.png */
  preview?: string | null;
}

export function ExternalPreview({ url, preview }: ExternalPreviewProps) {
  const t = useT();
  const [imgOk, setImgOk] = useState(true);
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, "");
  const path = u.pathname.replace(/\/$/, "");
  const showImg = !!preview && imgOk;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rise rise-3 mt-10 block rounded-3xl overflow-hidden border border-border bg-card hover:border-accent transition-all"
    >
      {/* Browser chrome + screenshot */}
      {showImg && (
        <div className="relative bg-elevated">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c93f]" />
            <span className="ml-3 px-3 py-1 rounded-md bg-bg text-[11px] font-mono text-muted truncate max-w-[80%]">
              {host}
              {path}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {t("ext.live")}
            </span>
          </div>
          <div className="relative aspect-[1440/650] overflow-hidden">
            <Image
              src={preview!}
              alt={`${host} preview`}
              fill
              sizes="(min-width: 768px) 800px, 100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              priority={false}
              unoptimized
              onError={() => setImgOk(false)}
            />
            {/* Subtle gradient overlay for legibility of any text below */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(0,0,0,0.06))",
              }}
              aria-hidden
            />
          </div>
        </div>
      )}

      {/* Footer row: label + CTA */}
      <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-6">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="eyebrow">{t("ext.guide")}</span>
          <span className="font-medium text-base sm:text-xl truncate">
            {host}
            <span className="text-muted">{path}</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-bg text-sm font-medium transition-all whitespace-nowrap">
          <span>{t("ext.open")}</span>
          <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
        </span>
      </div>
    </a>
  );
}
