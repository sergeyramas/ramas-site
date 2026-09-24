"use client";

/* eslint-disable react-hooks/static-components -- velite compiles MDX to a code string; the component is generated per-page from props at render time. */

import { useEffect, useMemo, useRef, useState } from "react";
import * as runtime from "react/jsx-runtime";

/**
 * Iframe that auto-resizes to fit its content: the embedded page posts
 * {type:"opus-report-resize", height} via postMessage on load/resize, and we
 * apply it here. Avoids an internal scrollbar on both desktop and mobile.
 */
function ResizableIframe(props: React.IframeHTMLAttributes<HTMLIFrameElement>) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!ref.current || event.source !== ref.current.contentWindow) return;
      const data = event.data as { type?: string; height?: number } | undefined;
      if (data?.type === "opus-report-resize" && typeof data.height === "number") {
        setHeight(Math.ceil(data.height) + 24);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const { style, ...rest } = props;
  return (
    <iframe
      {...rest}
      ref={ref}
      style={{ ...style, width: "100%", height, border: 0, display: "block", borderRadius: 12 }}
    />
  );
}

const sharedComponents = { iframe: ResizableIframe };

function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code, components }: { code: string; components?: Record<string, React.ComponentType> }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
