"use client";

import { useApplication } from "./ApplicationContext";

export function ApplicationCTA() {
  const { openPanel } = useApplication();

  return (
    <button
      onClick={() => openPanel()}
      className="btn btn-primary text-lg px-12 py-5"
    >
      Select Your Country
    </button>
  );
}
