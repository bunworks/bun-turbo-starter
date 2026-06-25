"use client";

import type * as React from "react";

function AspectRatio({
  ratio = 1,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${(1 / ratio) * 100}%`,
        ...style,
      }}
      className={className}
    >
      <div style={{ position: "absolute", inset: 0 }} {...props} />
    </div>
  );
}

export { AspectRatio };
