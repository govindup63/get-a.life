import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      marquee: DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          behavior?: "scroll" | "slide" | "alternate";
          direction?: "left" | "right" | "up" | "down";
          scrollamount?: number | string;
          scrolldelay?: number | string;
          loop?: number | string;
        },
        HTMLElement
      >;
    }
  }
}
