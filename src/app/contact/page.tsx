export default function ContactPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Contact</h1>
        <p className="text-neutral-600">
          Have a question about bookings, pricing, or support? Reach out anytime.
        </p>

        <div className="space-y-2 text-sm">
          <p>Email: <span className="font-medium">support@beyondhunger.com</span></p>
          <p>Location: London, United Kingdom</p>
        </div>
      </div>
    </section>
  );
}
