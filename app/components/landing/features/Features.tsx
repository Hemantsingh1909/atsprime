"use client";

import FeatureHeader from "./FeatureHeader";
import FeatureGrid from "./FeatureGrid";

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <FeatureHeader />

        <FeatureGrid />
      </div>
    </section>
  );
}