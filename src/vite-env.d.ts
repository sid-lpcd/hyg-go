/// <reference types="vite/client" />

// SVG imports with ?react suffix (vite-plugin-svgr)
declare module "*.svg?react" {
  import { FunctionComponent, SVGProps } from "react";
  const content: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default content;
}

// Regular SVG imports (as URL strings)
declare module "*.svg" {
  const content: string;
  export default content;
}