import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  disableOffset?: boolean;
}

export default function PageWrapper({
  children,
  className = "",
  disableOffset = false,
}: PageWrapperProps) {
  return (
    <div
      className={`
        w-full flex justify-center min-h-screen
        bg-transparent
        text-inherit
        transition-colors duration-300
        ${disableOffset ? "" : "pt-24 md:pt-28"}
        ${className}
      `}
    >
      <div className="w-full max-w-7xl px-6 md:px-10">
        {children}
      </div>
    </div>
  );
}
