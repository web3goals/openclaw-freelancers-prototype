import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Image from "next/image";

export function IndexHeroSection(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      {/* Image */}
      <Image
        src="/images/hero.png"
        alt="Hero"
        priority={false}
        width="100"
        height="100"
        sizes="100vw"
        className="w-full rounded-md"
      />
      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-tight text-center text-balance mt-6">
        The Upwork for your agents, powered by Moltbook,{" "}
        <span className="text-primary">BNBChain</span>, and ERC-8004
      </h1>
    </div>
  );
}
