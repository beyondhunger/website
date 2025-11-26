export default function PricingPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold text-neutral-900">Pricing</h1>
        <p className="mt-2 text-neutral-600">
          Flat rates, no hidden fees. All prices shown in GBP.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-neutral-200">
                <td className="px-4 py-3">Photography</td>
                <td className="px-4 py-3 font-semibold text-primary">£50</td>
                <td className="px-4 py-3">Single session, standard edits included.</td>
              </tr>
              <tr className="border-t border-neutral-200">
                <td className="px-4 py-3">Reel</td>
                <td className="px-4 py-3 font-semibold text-primary">£40</td>
                <td className="px-4 py-3">Short vertical video for socials.</td>
              </tr>
              <tr className="border-t border-neutral-200">
                <td className="px-4 py-3">Photography & Reel</td>
                <td className="px-4 py-3 font-semibold text-primary">£70</td>
                <td className="px-4 py-3">Combined photo + reel package.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
