/**
 * Blocks Shell — Page orchestrator for the Blocks page.
 * Manages tab state, palette URL params, scoped CSS injection, and preview/code toggle.
 */
"use client";

import { useId, useMemo, useCallback, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BiSolidDashboard } from "react-icons/bi";
import { Copy, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getStripeHex } from "@/data/all-palettes";
import { brandScopeCss, neutralScopeCss } from "@/lib/palette-theme";
import { generatePalette } from "@/lib/color-engine";
import { useCopy } from "@/hooks/use-copy";
import { BlocksToolbar } from "./blocks-toolbar";
import { AuthBlock } from "./auth-block";
import { SettingsBlock } from "./settings-block";
import { PricingBlock } from "./pricing-block";

const DEFAULT_BRAND = "blue";
const DEFAULT_NEUTRAL = "stone";

/* ── Code snippets per block ── */
const CODE_SNIPPETS: Record<string, { lang: string; code: string }> = {
  login: {
    lang: "tsx",
    code: `import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginForm() {
  return (
    <form className="space-y-6">
      <Input
        type="email"
        placeholder="you@example.com"
        leading={<Mail size={16} />}
      />
      <Input
        type="password"
        leading={<Lock size={16} />}
      />
      <Checkbox label="Remember me for 30 days" />
      <Button variant="primary" className="w-full">
        Sign in
      </Button>
    </form>
  )
}`,
  },
  preferences: {
    lang: "tsx",
    code: `import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Avatar } from '@/components/ui/avatar'

export default function SettingsForm() {
  return (
    <div className="space-y-6">
      <Avatar size="lg" initials="MS" />
      <Input label="Full name" defaultValue="Max Smith" />
      <Input label="Email" defaultValue="max@magiklch.com" />
      <Toggle
        label="Marketing emails"
        description="Receive product updates"
        defaultChecked
      />
      <Button variant="primary" size="sm">
        Save changes
      </Button>
    </div>
  )
}`,
  },
  pricing: {
    lang: "tsx",
    code: `import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <TierCard name="Free" price="$0" cta="Get started" />
      <TierCard
        name="Pro"
        price="$19"
        cta="Start free trial"
        highlighted
      >
        <Badge variant="brand" size="sm">
          Most popular
        </Badge>
      </TierCard>
      <TierCard
        name="Enterprise"
        price="$49"
        cta="Contact sales"
      />
    </div>
  )
}`,
  },
};

export function BlocksShell() {
  const scopeId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"preview" | "code">("preview");
  const [codeCollapsed, setCodeCollapsed] = useState(false);
  const { copy } = useCopy();

  const rawBrand = searchParams.get("brand") ?? DEFAULT_BRAND;
  const neutralId = searchParams.get("neutral") ?? DEFAULT_NEUTRAL;
  const activeTab = searchParams.get("tab") ?? "login";

  // Custom brand mode: brand=custom&h=259&c=0.214
  const customH = rawBrand === "custom" ? parseFloat(searchParams.get("h") ?? "") : NaN;
  const customC = rawBrand === "custom" ? parseFloat(searchParams.get("c") ?? "") : NaN;
  const isCustomBrand = rawBrand === "custom" && !isNaN(customH) && !isNaN(customC);
  const brandId = isCustomBrand ? "custom" : (rawBrand === "custom" ? DEFAULT_BRAND : rawBrand);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleBrandChange = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("brand", id);
      params.delete("h");
      params.delete("c");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const brandHex = useMemo(() => {
    if (isCustomBrand) {
      const palette = generatePalette({ l: 0.65, c: customC, h: customH }, "custom");
      return (palette.shades ?? [])
        .filter((s) => s.step !== 975)
        .map((s) => s.hex);
    }
    const hex = getStripeHex(brandId);
    return hex.length > 0 ? hex : getStripeHex(DEFAULT_BRAND);
  }, [isCustomBrand, customH, customC, brandId]);
  const neutralHex = useMemo(
    () => getStripeHex(neutralId).length > 0 ? getStripeHex(neutralId) : getStripeHex(DEFAULT_NEUTRAL),
    [neutralId]
  );

  const scopedCss = useMemo(
    () =>
      brandScopeCss(scopeId, brandHex) +
      "\n" +
      neutralScopeCss(scopeId, neutralHex),
    [scopeId, brandHex, neutralHex]
  );

  const snippet = CODE_SNIPPETS[activeTab] ?? CODE_SNIPPETS.login;
  const lines = snippet.code.split("\n");

  return (
    <div data-slot="blocks-shell">
      {/* ── Header ── */}
      <PageHeader
        icon={BiSolidDashboard}
        title="Blocks"
        subtitle="Preview your palette on realistic UI templates."
        rightContent={
          isCustomBrand ? (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/?h=${customH}&c=${customC}`}>
                Edit palette
              </Link>
            </Button>
          ) : undefined
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(val) => updateParam("tab", val)}
        variant="underline"
        size="md"
      >
        {/* ── Tab Bar ── */}
        <div className="border-b border-[var(--border-default)] px-6 lg:px-12">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Color Switcher ── */}
        <div className="border-b border-[var(--border-default)] px-6 py-3.5 lg:px-12">
          <BlocksToolbar
            brandId={brandId}
            neutralId={neutralId}
            onBrandChange={handleBrandChange}
            onNeutralChange={(id) => updateParam("neutral", id)}
            customBrandHex={isCustomBrand ? brandHex : undefined}
          />
        </div>

        {/* ── Preview / Code Section ── */}
        <div className="px-6 pt-6 pb-12 lg:px-12">
          <div className="overflow-hidden rounded-xl border border-[var(--border-default)]">
            {/* Toolbar */}
            <div className="flex items-center gap-4 border-b border-[var(--border-default)] bg-[var(--background-base)] px-4 py-3">
              <div className="flex rounded-full bg-[var(--background-neutral-lighter-default)] p-1">
                <button
                  onClick={() => setView("preview")}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-sm font-medium transition-colors ${
                    view === "preview"
                      ? "bg-[var(--background-base)] text-[var(--text-base-strong)] shadow-sm"
                      : "text-[var(--text-base-moderate)] hover:text-[var(--text-base-strong)]"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => { setView("code"); setCodeCollapsed(false); }}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-sm font-medium transition-colors ${
                    view === "code"
                      ? "bg-[var(--background-base)] text-[var(--text-base-strong)] shadow-sm"
                      : "text-[var(--text-base-moderate)] hover:text-[var(--text-base-strong)]"
                  }`}
                >
                  Code
                </button>
              </div>
              <span className="text-sm text-[var(--text-base-moderate)]">
                <TabsContent value="login" className="mt-0 inline" asChild>
                  <span>A clean login form with social auth and input validation</span>
                </TabsContent>
                <TabsContent value="preferences" className="mt-0 inline" asChild>
                  <span>Settings page with profile, toggles and notification preferences</span>
                </TabsContent>
                <TabsContent value="pricing" className="mt-0 inline" asChild>
                  <span>Pricing page with three tiers and feature comparison</span>
                </TabsContent>
              </span>
            </div>

            {/* Preview */}
            {view === "preview" && (
              <>
                <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
                <div
                  data-blocks-scope={scopeId}
                  className="bg-[var(--background-neutral-faint-default)] p-8"
                >
                  <TabsContent value="login" className="mt-0">
                    <AuthBlock />
                  </TabsContent>
                  <TabsContent value="preferences" className="mt-0">
                    <SettingsBlock />
                  </TabsContent>
                  <TabsContent value="pricing" className="mt-0">
                    <PricingBlock />
                  </TabsContent>
                </div>
              </>
            )}

            {/* Code */}
            {view === "code" && (
              <div className="bg-[var(--background-base)]">
                {/* Code header */}
                <div className="flex items-center justify-between border-b border-[var(--border-divider)] px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-base-moderate)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    {snippet.lang}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCodeCollapsed(!codeCollapsed)}
                      className="rounded p-1.5 text-[var(--text-base-moderate)] transition-colors hover:bg-[var(--background-neutral-lighter-default)] hover:text-[var(--text-base-strong)]"
                      aria-label={codeCollapsed ? "Expand code" : "Collapse code"}
                    >
                      <ChevronUp size={14} className={`transition-transform ${codeCollapsed ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={() => copy(snippet.code, "Code snippet")}
                      className="rounded p-1.5 text-[var(--text-base-moderate)] transition-colors hover:bg-[var(--background-neutral-lighter-default)] hover:text-[var(--text-base-strong)]"
                      aria-label="Copy code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Code body */}
                {!codeCollapsed && (
                  <div className="overflow-x-auto p-5">
                    <table className="w-full border-collapse font-mono text-[13px] leading-[1.7]">
                      <tbody>
                        {lines.map((line, i) => (
                          <tr key={i} className="group">
                            <td className="select-none pr-5 text-right align-top text-[var(--text-base-moderate)] w-[1%] whitespace-nowrap">
                              {i + 1}
                            </td>
                            <td className="text-[var(--text-base-strong)] whitespace-pre">
                              {line}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
