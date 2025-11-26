export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-black text-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-sm md:flex-row md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-primary">Beyond Hunger</h3>
          <p className="mt-2 max-w-xs text-neutral-400">
            Photography & Reels booking platform built in London.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Contact
          </h4>
          <p className="mt-2 text-neutral-300">London, UK</p>
          <p className="text-neutral-300">support@beyondhunger.com</p>
        </div>

        <div className="text-neutral-500 md:text-right">
          © {new Date().getFullYear()} Beyond Hunger. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
