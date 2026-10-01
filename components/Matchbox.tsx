import Image from "next/image";

const looks = ["bg-vermillion-deep text-cream", "bg-teal-deep text-cream", "bg-marigold text-ink", "bg-rani-deep text-cream"];

// Sponsor logo framed as a vintage matchbox label. Pure CSS hover, no JS.
export function Matchbox({ name, logo, index, big = false }: { name: string; logo: string; index: number; big?: boolean }) {
  return (
    <div className={`group rounded-sm border-[3px] border-ink p-2 shadow-[5px_5px_0_var(--color-ink)] transition-transform duration-200 hover:-rotate-2 hover:scale-105 ${looks[index % looks.length]}`}>
      <div className="flex h-full flex-col items-center gap-2 border-2 border-current p-3 text-center outline-2 outline-offset-2 outline-current [outline-style:dashed]">
        <div className={`relative w-full overflow-hidden rounded-sm border-2 border-ink bg-white ${big ? "h-32 sm:h-40" : "h-20 sm:h-24"}`}>
          <Image src={logo} alt={`${name} logo`} fill sizes={big ? "(min-width: 640px) 420px, 90vw" : "(min-width: 640px) 200px, 45vw"} className="object-contain p-2" />
        </div>
        <p className={`font-display leading-tight ${big ? "text-2xl sm:text-3xl" : "text-sm sm:text-base"}`}>{name}</p>
      </div>
    </div>
  );
}
