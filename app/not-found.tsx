import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center px-4 pt-24 text-center">
      <div>
        <p className="font-mono text-sm tracking-[.3em]">NO SIGNAL · सिग्नल नहीं</p>
        <h1 className="font-display text-[clamp(4rem,20vw,10rem)] leading-none misprint">404</h1>
        <p className="mt-2 font-poster text-2xl">Rukavat ke liye khed hai.</p>
        <Link href="/" className="btn mt-8 bg-marigold">
          Back to channel 1
        </Link>
      </div>
    </section>
  );
}
