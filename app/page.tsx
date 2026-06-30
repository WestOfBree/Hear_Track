'use client';
import Image from "next/image";
import ServiceTrackerModule from "./UI/ServiceTrackerModule";
import NavBar from "./UI/NavBar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-(--surface-muted) font-sans text-foreground">
      <main className="flex w-full flex-1 flex-col items-center justify-between bg-(--surface) px-16 py-32 sm:items-start">
        <Image
          className=""
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

      </main>
    <section>

    </section>
    </div>
  );
}
