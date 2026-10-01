"use client";

// "Now showing" reel under the category tabs: the first two events of every category as tickets,
// carried sideways by HorizontalScroll, ending in an Interval card that jumps back to the tabs.
import { ArrowUp } from "@phosphor-icons/react";
import { eventCategories } from "@/data/events";
import HorizontalScroll from "./HorizontalScroll";
import { Ticket } from "./EventsPanels";
import { getLenis } from "./ScrollFx";

const reel = eventCategories.flatMap((c) => c.subEvents.slice(0, 2).map((ev, i) => ({ ev, category: c.title, key: `${c.id}-${i}` })));
const total = eventCategories.reduce((n, c) => n + c.subEvents.length, 0);

export default function EventsReel() {
  function backToTabs() {
    const target = document.getElementById("categories");
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <HorizontalScroll
      label="Featured events"
      heading={
        <div className="mb-8">
          <p className="font-deva text-3xl text-rani">अभी चल रहा है</p>
          <h2 className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[.95] misprint">Now showing</h2>
          <p className="mt-3 max-w-2xl text-lg">
            Two picks from every category. Keep scrolling; there are {total - reel.length} more in the tabs above.
          </p>
        </div>
      }
    >
      {reel.map(({ ev, category, key }, i) => (
        <li key={key} className="w-[min(82vw,26rem)] shrink-0">
          <Ticket ev={ev} category={category} serial={i} />
        </li>
      ))}
      <li className="w-[min(70vw,18rem)] shrink-0">
        <button
          type="button"
          onClick={backToTabs}
          className="group relative flex h-full w-full flex-col justify-between gap-6 overflow-hidden border-[3px] border-ink bg-marigold p-6 text-left shadow-[6px_6px_0_var(--color-ink)] transition-transform hover:-translate-y-1"
        >
          <span className="halftone pointer-events-none absolute inset-0 text-ink/15" aria-hidden="true" />
          <span className="relative font-mono text-xs font-bold tracking-[.3em]">INTERVAL · मध्यांतर</span>
          <span className="relative font-display text-5xl leading-none">+{total - reel.length} more shows</span>
          <span className="relative inline-flex items-center gap-2 font-display text-lg group-hover:underline">
            Browse categories <ArrowUp weight="bold" aria-hidden="true" />
          </span>
        </button>
      </li>
    </HorizontalScroll>
  );
}
