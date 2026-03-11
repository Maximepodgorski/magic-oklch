"use client";

import {
  BiBookmarkHeart,
  BiGlobe,
  BiPointer,
  BiPalette,
} from "react-icons/bi";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded-[var(--layout-radius-sm)] border border-border bg-[var(--background-neutral-faint-default)] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
      {children}
    </kbd>
  );
}

const STEPS = [
  {
    icon: BiBookmarkHeart,
    title: "Show your bookmarks bar",
    description: (
      <span>
        Press <Kbd>⌘ Shift B</Kbd> on Mac or <Kbd>Ctrl Shift B</Kbd> on
        Windows to reveal it.
      </span>
    ),
  },
  {
    icon: null,
    svg: true,
    title: 'Drag "Steal colors" to the bar',
    description:
      "Drag the button on this page to your bookmarks bar. One-time setup.",
  },
  {
    icon: BiGlobe,
    title: "Visit any website",
    description: "Navigate to any site whose colors you want to extract.",
  },
  {
    icon: BiPointer,
    title: "Click the bookmark",
    description:
      "It reads every color on the page and opens Magiklch with the results.",
  },
  {
    icon: BiPalette,
    title: "Generate a palette",
    description:
      "Click any extracted color to generate a full 11-shade OKLCH palette.",
  },
] as const;

function StepIcon({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  if ("svg" in step && step.svg) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path d="M6 0C9.31369 0 12 2.68631 12 6V18C12 21.3137 9.31369 24 6 24C2.68631 24 0 21.3137 0 18C0 14.6863 2.68631 12 6 12C2.68631 12 0 9.31369 0 6C0 2.68631 2.68631 0 6 0ZM18 12C14.6863 12 12 9.31369 12 6C12 2.68631 14.6863 0 18 0C21.3137 0 24 2.68631 24 6V18C24 21.3137 21.3137 24 18 24C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12Z" />
      </svg>
    );
  }
  if (step.icon) {
    const Icon = step.icon;
    return <Icon size={16} />;
  }
  return <span className="text-xs font-semibold">{index + 1}</span>;
}

export function HowItWorksModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="terciary" size="sm">
          How it works
        </Button>
      </ModalTrigger>
      <ModalContent size="lg" className="!w-[32.5rem]">
        <ModalHeader>
          <ModalTitle>How it works</ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalBody className="gap-0 !p-0">
          {STEPS.map((step, i) => (
            <div key={i}>
              <div className="flex items-start gap-3 px-[var(--layout-padding-xl)] py-3.5">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[var(--layout-radius-md)] bg-[var(--background-neutral-faint-default)] text-[var(--text-base-moderate)]">
                  <StepIcon step={step} index={i} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold text-[var(--text-base-bolder)]">
                    {step.title}
                  </p>
                  <p className="text-[13px] text-[var(--text-base-moderate)]">
                    {step.description}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="border-b border-border" />
              )}
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary" size="sm">
              Got it
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
