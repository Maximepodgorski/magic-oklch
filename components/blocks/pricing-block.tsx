/**
 * Pricing Block — 3-tier pricing cards for the Blocks page.
 * Free / Pro (highlighted) / Enterprise.
 *
 * NO Portal-based components (Select, DropdownMenu, Modal, Tooltip).
 * All colors via semantic tokens — adapts to scoped palette overrides.
 */
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Feature {
  label: string;
}

interface Tier {
  name: string;
  description: string;
  price: string;
  period: string;
  features: Feature[];
  cta: string;
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    description: "Get started with the basics",
    price: "$0",
    period: "/month",
    features: [
      { label: "5 palettes" },
      { label: "OKLCH output" },
      { label: "Hex & HSL export" },
      { label: "Community support" },
    ],
    cta: "Get started",
  },
  {
    name: "Pro",
    description: "For professional designers",
    price: "$19",
    period: "/month",
    highlighted: true,
    features: [
      { label: "Unlimited palettes" },
      { label: "All export formats" },
      { label: "API access" },
      { label: "Priority support" },
      { label: "Design tokens" },
      { label: "Figma plugin" },
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "$49",
    period: "/month",
    features: [
      { label: "Everything in Pro" },
      { label: "Team workspaces" },
      { label: "Custom branding" },
      { label: "SSO / SAML" },
      { label: "Dedicated support" },
      { label: "SLA guarantee" },
    ],
    cta: "Contact sales",
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const { name, description, price, period, features, cta, highlighted } = tier;

  return (
    <div
      className={`flex flex-col gap-6 rounded-xl border p-7 bg-[var(--background-base)] ${
        highlighted
          ? "border-[var(--border-brand-strong)] border-2"
          : "border-[var(--border-default)]"
      }`}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold text-[var(--text-base-strong)]">
            {name}
          </span>
          {highlighted && (
            <Badge variant="brand" type="light" size="sm">
              Most popular
            </Badge>
          )}
        </div>
        <p className="text-[13px] text-[var(--text-base-moderate)]">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold leading-none text-[var(--text-base-strong)]">
          {price}
        </span>
        <span className="text-sm text-[var(--text-base-moderate)]">
          {period}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--border-divider)]" />

      {/* Features */}
      <div className="flex flex-col gap-3">
        {features.map((f) => (
          <div key={f.label} className="flex items-center gap-2.5">
            <Check
              size={16}
              className={
                highlighted
                  ? "text-[var(--icon-brand-moderate)]"
                  : "text-[var(--icon-neutral-moderate)]"
              }
            />
            <span className="text-[13px] text-[var(--text-base-strong)]">
              {f.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        {highlighted ? (
          <Button variant="primary" size="md" className="w-full">
            {cta}
          </Button>
        ) : (
          <Button variant="secondary" size="md" className="w-full">
            {cta}
          </Button>
        )}
      </div>
    </div>
  );
}

export function PricingBlock() {
  return (
    <div
      data-slot="pricing-block"
      className="grid gap-5 rounded-xl border border-[var(--border-default)] bg-[var(--background-neutral-faint-default)] p-6 lg:grid-cols-3"
    >
      {TIERS.map((tier) => (
        <TierCard key={tier.name} tier={tier} />
      ))}
    </div>
  );
}
