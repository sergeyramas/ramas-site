"use client";

import dynamic from "next/dynamic";

const CustomCursorDynamic = dynamic(
  () => import("@/components/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false, loading: () => null },
);

export function CustomCursorLazy() {
  return <CustomCursorDynamic />;
}
