import type { Metadata } from "next";
import { CatalogueGrid } from "@/components/catalogue/catalogue-grid";

export const metadata: Metadata = {
  title: "Palette Catalogue — MagicOKLCH",
  description:
    "Browse 22 Tailwind-inspired and 7 curated OKLCH palettes. Click any palette to open it in the generator.",
};

export default function CataloguePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-[var(--layout-gap-2xl)]">
        <div className="flex flex-col gap-[var(--layout-gap-xs)]">
          <h1 className="text-heading-medium font-accent text-content-primary">
            Palette Catalogue
          </h1>
          <p className="text-content-note text-content-secondary">
            Browse Tailwind-inspired and curated OKLCH palettes. Click any palette to open it in the generator.
          </p>
        </div>
        <CatalogueGrid />
      </div>
    </div>
  );
}
