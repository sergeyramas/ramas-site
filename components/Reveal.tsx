"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

type Props = {
  children: ReactNode;
  delay?: number; // ms
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
  /** Distance to translate from on enter, in px. Default 16. */
  offset?: number;
};

export function Reveal({ children, delay = 0, className = "", as = "div", offset = 16 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [visible, setVisible] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            observer.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReduced]);

  const style: CSSProperties = {
    transition: "opacity 700ms cubic-bezier(0.2,0.7,0.2,1), transform 700ms cubic-bezier(0.2,0.7,0.2,1)",
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
    willChange: "opacity, transform",
  };

  const common = { className, style, children };
  if (as === "section") return <section ref={ref as RefObject<HTMLElement>} {...common} />;
  if (as === "li") return <li ref={ref as RefObject<HTMLLIElement>} {...common} />;
  if (as === "article") return <article ref={ref as RefObject<HTMLElement>} {...common} />;
  if (as === "header") return <header ref={ref as RefObject<HTMLElement>} {...common} />;
  return <div ref={ref as RefObject<HTMLDivElement>} {...common} />;
}
