"use client";

import * as runtime from "react/jsx-runtime";

const sharedComponents = {};

function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code, components }: { code: string; components?: Record<string, React.ComponentType> }) {
  const Component = getMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
