"use client";

import React from "react";
import { useApplication } from "@/components/application/ApplicationContext";

interface PrimaryCTAProps {
  label: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3 text-base",
  lg: "px-9 py-4 text-lg",
};

export default function PrimaryCTA({
  label,
  size = "md",
  fullWidth = false,
  className = "",
}: PrimaryCTAProps) {
  const { openPanel } = useApplication();

  return (
    <button
      onClick={openPanel}
      className={`
        btn
        btn-primary
        rounded-full
        ${sizeMap[size]}
        ${fullWidth ? "w-full" : ""}
        shadow-lg
        hover:shadow-xl
        transition-all
        ${className}
      `}
    >
      {label}
    </button>
  );
}
