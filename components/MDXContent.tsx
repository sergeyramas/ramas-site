"use client";

/* eslint-disable react-hooks/static-components -- velite compiles MDX to a code string; the component is generated per-page from props at render time. */

import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";

const sharedComponents = {};

function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code, components }: { code: string; components?: Record<string, React.ComponentType> }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
