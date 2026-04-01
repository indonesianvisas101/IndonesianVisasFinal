"use client";

import dynamic from "next/dynamic";

const GCIHighlightSection = dynamic(() => import("./GCIHighlightSection"), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400 font-bold animate-pulse">Loading GCI Hub...</div>
});

export default function GCIWrapper({ dict }: { dict?: any }) {
  return <GCIHighlightSection dict={dict} />;
}
