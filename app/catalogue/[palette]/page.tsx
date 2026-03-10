import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPaletteById } from "@/data/all-palettes";
import { PaletteDetailShell } from "@/components/catalogue/palette-detail-shell";

interface Props {
  params: Promise<{ palette: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { palette: id } = await params;
  const palette = getPaletteById(id);
  if (!palette) return { title: "Not Found" };

  return {
    title: `${palette.name} OKLCH Palette`,
    description: `${palette.name} color palette in OKLCH with 11 perceptually uniform shades. ${palette.source === "tailwind" ? "Tailwind-inspired" : "Custom"} palette with APCA contrast scores, sRGB/P3 gamut info. Export as HEX, HSL, OKLCH, or CSS variables.`,
    alternates: { canonical: `/catalogue/${id}` },
  };
}

export default async function PaletteDetailPage({ params }: Props) {
  const { palette: id } = await params;
  const palette = getPaletteById(id);

  if (!palette) notFound();

  return (
    <PaletteDetailShell palette={palette} />
  );
}
