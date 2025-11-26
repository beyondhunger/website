export default function Section({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white min-h-[60vh] flex items-center py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-red-600 leading-snug">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
          )}

          <div className="mt-6">
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition">
              Download Now
            </button>
          </div>

          <div className="mt-8 bg-red-600 text-white p-6 rounded-lg shadow text-lg font-medium">
            {children}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <img
            src="/iphonex.jpg"
            alt="iPhone"
            className="w-[260px] md:w-[340px] h-auto object-contain"
          />

          <div className="flex items-center gap-3 mt-6">
            <img
              src="/applex.jpg"
              alt="Apple Store"
              className="w-8 h-8 object-contain"
            />
            <p className="text-base md:text-lg font-medium text-red-600">
              Available on the App Store
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
