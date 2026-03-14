/**
 * Auth Block — Login form template for the Blocks page.
 * Dark hero panel (left) + sign-in form (right).
 *
 * NO Portal-based components (Select, DropdownMenu, Modal, Tooltip).
 * All colors via semantic tokens — adapts to scoped palette overrides.
 */
import { BiLogoGithub, BiLogoLinkedin } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { LogoSvg } from "@/components/layout/logo-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function AuthBlock() {
  return (
    <div
      data-slot="auth-block"
      className="grid min-h-[620px] overflow-hidden rounded-xl border border-[var(--border-default)] lg:grid-cols-[1.2fr_1fr]"
    >
      {/* ── Left: Dark Hero Panel ── */}
      <div className="hidden flex-col justify-between bg-[var(--background-neutral-strong-default)] px-10 py-12 lg:flex">
        {/* Top: Logo + Headline + Tagline */}
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <LogoSvg
            className="h-6 w-auto self-start"
            style={{ "--icon-neutral-strong": "var(--background-base)" } as React.CSSProperties}
          />

          {/* Bold headline */}
          <h2 className="text-[38px] font-bold leading-[1.1] tracking-tight text-[var(--background-base)]">
            See Color
            <br />
            Differently.
          </h2>

          {/* Tagline */}
          <p className="text-sm leading-relaxed text-[var(--root-color-neutral-500)]">
            Perceptually uniform palettes
            <br />
            powered by OKLCH color science.
          </p>
        </div>

        {/* Bottom: Social links */}
        <div className="flex items-center gap-5">
          <BiLogoGithub size={20} className="text-[var(--root-color-neutral-500)]" />
          <BsTwitterX size={18} className="text-[var(--root-color-neutral-500)]" />
          <BiLogoLinkedin size={20} className="text-[var(--root-color-neutral-500)]" />
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex flex-col justify-center bg-[var(--background-base)] p-8 lg:p-10">
        <div className="mx-auto w-full max-w-[340px] space-y-7">
          <div className="space-y-1.5">
            <h2 className="text-[22px] font-semibold text-[var(--text-base-strong)]">
              Welcome back
            </h2>
            <p className="text-sm text-[var(--text-base-moderate)]">
              Sign in to your account to continue
            </p>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm">
              <BiLogoGithub size={16} />
              GitHub
            </Button>
            <Button variant="secondary" size="sm">
              <FcGoogle size={16} />
              Google
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border-divider)]" />
            <span className="text-xs text-[var(--text-base-medium)]">or</span>
            <div className="h-px flex-1 bg-[var(--border-divider)]" />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-[13px] font-medium text-[var(--text-base-strong)]">
              Email
            </label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              leading={<Mail size={16} />}
              readOnly
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="auth-password" className="text-[13px] font-medium text-[var(--text-base-strong)]">
                Password
              </label>
              <span className="cursor-pointer text-sm text-[var(--link-primary-default)]">
                Forgot password?
              </span>
            </div>
            <Input
              id="auth-password"
              type="password"
              defaultValue="••••••••••"
              leading={<Lock size={16} />}
              readOnly
            />
          </div>

          {/* Remember */}
          <Checkbox
            label="Remember me for 30 days"
            defaultChecked
            size="sm"
          />

          {/* Submit */}
          <Button
            variant="secondary"
            size="md"
            className="w-full bg-[var(--background-neutral-strong-default)] text-[var(--background-base)] border-transparent hover:bg-[var(--background-neutral-strong-hover)]"
          >
            Sign in
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-[var(--text-base-moderate)]">
            Don&rsquo;t have an account?{" "}
            <span className="cursor-pointer font-medium text-[var(--link-primary-default)]">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
