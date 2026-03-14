/**
 * Settings Block — Preferences template for the Blocks page.
 * Brand banner + profile card + notification toggles + action buttons.
 *
 * NO Portal-based components (Select, DropdownMenu, Modal, Tooltip).
 * All colors via semantic tokens — adapts to scoped palette overrides.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { BannerInfo } from "@/components/ui/banner-info";
import { Avatar } from "@/components/ui/avatar";

export function SettingsBlock() {
  return (
    <div
      data-slot="settings-block"
      className="space-y-6 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--background-base)] p-5 lg:p-6"
    >
      {/* ── Brand Banner ── */}
      <BannerInfo variant="brand" withIcon className="items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <span>
            Your trial ends in 14 days. Upgrade to keep all features.
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 bg-[var(--background-brand-strong-default)] text-white border-transparent hover:bg-[var(--background-brand-strong-hover)]"
          >
            Upgrade
          </Button>
        </div>
      </BannerInfo>

      {/* ── Profile Section ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--text-base-strong)]">
          Profile
        </h3>

        <div className="rounded-[10px] border border-[var(--border-default)] bg-[var(--background-base)] p-6 space-y-5">
          {/* Profile header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                initials="MS"
                className="bg-[var(--background-brand-strong-default)] text-white"
              />
              <div>
                <p className="font-medium text-[var(--text-base-strong)]">
                  Max Smith
                </p>
                <p className="text-sm text-[var(--text-base-moderate)]">
                  max@magiklch.com
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Change
            </Button>
          </div>

          <div className="h-px bg-[var(--border-divider)]" />

          {/* Name / Email fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="settings-name" className="text-sm font-medium text-[var(--text-base-strong)]">
                Full name
              </label>
              <Input id="settings-name" defaultValue="Max Smith" readOnly />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="settings-email" className="text-sm font-medium text-[var(--text-base-strong)]">
                Email
              </label>
              <Input id="settings-email" defaultValue="max@magiklch.com" readOnly />
            </div>
          </div>

          <div className="h-px bg-[var(--border-divider)]" />

          {/* Email notifications */}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[var(--text-base-strong)]">
              Email notifications
            </h4>

            <div className="divide-y divide-[var(--border-divider)]">
              <Toggle
                label="Marketing emails"
                description="Receive product updates"
                defaultChecked
                size="sm"
                className="py-3"
              />
              <Toggle
                label="Security alerts"
                description="Get notified about suspicious activity"
                defaultChecked
                size="sm"
                className="py-3"
              />
              <Toggle
                label="Weekly digest"
                description="Summary of your palette activity"
                size="sm"
                className="py-3"
              />
            </div>
          </div>

          <div className="h-px bg-[var(--border-divider)]" />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
