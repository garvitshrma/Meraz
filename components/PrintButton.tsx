"use client";

import { DownloadSimple } from "@phosphor-icons/react";

// The reference button has no handler. Here it opens the print dialog, where "Save as PDF" downloads the
// full schedule (print styles show every day as a plain table).
export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn bg-marigold">
      <DownloadSimple weight="bold" aria-hidden="true" /> Download Full Schedule
    </button>
  );
}
