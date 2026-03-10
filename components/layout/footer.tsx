export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
        <p>
          Magiklch &middot; MIT License &middot;{" "}
          <a
            href="https://github.com/maximepodgorski/oklch-generator"
            className="underline underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
