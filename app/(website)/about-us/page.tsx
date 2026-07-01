import Image from "next/image";
import Link from "next/link";

const points = [
  {
    title: "Cleared rights",
    text: "Master Rights, Publishing Rights, and Neighbouring Rights are cleared and ready to use.",
  },
  {
    title: "Global catalog",
    text: "Music is sourced from composers, recording studios, music publishers, and record companies around the world.",
  },
  {
    title: "Project ready",
    text: "Find high-quality tracks for movies, advertising, TV series, and multimedia projects.",
  },
];

export default function AboutUsPage() {
  return (
    <section className="min-h-full overflow-hidden rounded-[12px] bg-[#FFFFFF1A] text-white">
      <div className="relative min-h-[360px] px-5 py-12 sm:px-8 lg:px-12">
        <Image
          src="/banner.png"
          alt="BeatBoks music catalog"
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/80 to-[#0e0e0e]/30" />

        <div className="relative z-10 flex min-h-[260px] max-w-3xl flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00EF01]">
            About Us
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">
            Music cleared for every story.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#D6D6D6] sm:text-lg">
            BeatBoks Music Group gives access to over 5,000 tracks in a unique,
            extensive catalog to find high-quality music for your movie,
            advertising, TV series, or other multimedia projects.
          </p>
          <div className="mt-8">
            <Link
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#00EF01] px-6 text-sm font-semibold text-black transition hover:bg-[#1ed760]"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-3 md:grid-cols-3">
          {points.map((point) => (
            <article
              key={point.title}
              className="rounded-lg border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold text-white">
                {point.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#A8A8A8]">
                {point.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-lg border border-white/10 bg-[#0e0e0e]/45 p-5 sm:p-7 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#00EF01]">
              Rights
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              100% copyright ownership cleared through the publisher.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-[#CFCFCF] sm:text-base">
            <p>
              The music is licensed from a music publisher who owns 100% of all
              copyrights: Master Rights, Publishing Rights, and Neighbouring
              Rights.
            </p>
            <p>
              The catalog is purchased directly from composers, recording
              studios, music publishers, and record companies around the world,
              which may include AI-created songs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
