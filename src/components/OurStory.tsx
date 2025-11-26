export default function OurStory() {
  return (
    <section className="bg-red-600 min-h-[60vh] flex items-center py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        <div className="flex justify-center">
          <img
            src="/groupo.jpg"
            alt="Our Story"
            className="w-full max-w-2xl h-auto object-cover rounded-xl shadow-2xl"
          />
        </div>

        <div className="text-white">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            About Us:
          </h2>

          <p className="mb-4 text-lg leading-relaxed">
            It’s a newborn company formed by <strong>Mr. Shiva Krishna</strong>.
            Our goal is to keep every product and experience digitally handy.
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            The idea is planted in London, UK in 2025. We started our first
            service delivery onscreen — from photography to Instagram reels.
          </p>

          <p className="text-lg leading-relaxed">
            Building trust by delivering realistic content that connects to the
            heart and makes every moment memorable.
          </p>
        </div>
      </div>
    </section>
  );
}
