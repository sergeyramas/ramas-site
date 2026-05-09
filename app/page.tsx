import type { Metadata } from "next";
import { featured, allByKind } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { FounderCard } from "@/components/FounderCard";
import { FeaturedBento } from "@/components/Grid";
import { FeaturedHeader } from "@/components/FeaturedHeader";
import { HomeSections } from "@/components/HomeSections";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featuredItems = featured(4);
  const counts = {
    solution: allByKind("solution").length,
    project: allByKind("project").length,
    idea: allByKind("idea").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8">
      <Hero />

      <Reveal as="div" delay={50}>
        <FounderCard />
      </Reveal>

      {featuredItems.length > 0 && (
        <Reveal as="section" delay={100} className="mt-12">
          <FeaturedHeader />
          <FeaturedBento items={featuredItems} />
        </Reveal>
      )}

      <Reveal as="section" delay={150} className="mt-32 sm:mt-40">
        <HomeSections counts={counts} />
      </Reveal>
    </div>
  );
}
