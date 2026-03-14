/**
 * Blocks Shell — Page orchestrator for the Blocks page.
 * Manages tab state, palette URL params, scoped CSS injection, and preview area.
 */
"use client";

import { useId, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BiSolidDashboard } from "react-icons/bi";
import { PageHeader } from "@/components/layout/page-header";
import { getStripeHex } from "@/data/all-palettes";
import { brandScopeCss, neutralScopeCss } from "@/lib/palette-theme";
import { BlocksToolbar } from "./blocks-toolbar";
import { AuthBlock } from "./auth-block";
import { SettingsBlock } from "./settings-block";

const DEFAULT_BRAND = "blue";
const DEFAULT_NEUTRAL = "stone";

export function BlocksShell() {
  const scopeId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const brandId = searchParams.get("brand") ?? DEFAULT_BRAND;
  const neutralId = searchParams.get("neutral") ?? DEFAULT_NEUTRAL;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const brandHex = useMemo(
    () => getStripeHex(brandId).length > 0 ? getStripeHex(brandId) : getStripeHex(DEFAULT_BRAND),
    [brandId]
  );
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

  return (
    <div data-slot="blocks-shell">
      {/* ── Header ── */}
      <PageHeader
        icon={BiSolidDashboard}
        title="Blocks"
        subtitle="Preview your palette on realistic UI templates."
      />

      <Tabs defaultValue="login" variant="underline" size="md">
        {/* ── Tab Bar ── */}
        <div className="border-b border-[var(--border-default)] px-6 lg:px-12">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Color Switcher ── */}
        <div className="border-b border-[var(--border-default)] px-6 py-3.5 lg:px-12">
          <BlocksToolbar
            brandId={brandId}
            neutralId={neutralId}
            onBrandChange={(id) => updateParam("brand", id)}
            onNeutralChange={(id) => updateParam("neutral", id)}
          />
        </div>

        {/* ── Preview Section ── */}
        <div className="px-6 pt-6 pb-12 lg:px-12">
          <div className="overflow-hidden rounded-xl border border-[var(--border-default)]">
            {/* Toolbar */}
            <div className="flex items-center gap-4 border-b border-[var(--border-default)] bg-[var(--background-base)] px-4 py-3">
              <div className="flex rounded-full bg-[var(--background-neutral-lighter-default)] p-1">
                <span className="rounded-full bg-[var(--background-base)] px-3 py-1 text-sm font-medium text-[var(--text-base-strong)] shadow-sm">
                  Preview
                </span>
                <span className="rounded-full px-3 py-1 text-sm font-medium text-[var(--text-base-moderate)]">
                  Code
                </span>
              </div>
              <span className="text-sm text-[var(--text-base-moderate)]">
                <TabsContent value="login" className="mt-0 inline" asChild>
                  <span>A clean login form with social auth and input validation</span>
                </TabsContent>
                <TabsContent value="preferences" className="mt-0 inline" asChild>
                  <span>Settings page with profile, toggles and notification preferences</span>
                </TabsContent>
              </span>
            </div>

            {/* Block Container */}
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
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
