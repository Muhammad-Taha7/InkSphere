import React from 'react';

const JourneyComponent = () => {
  return (
    /* Full edge-to-edge container without horizontal margins or padding */
    <section className="w-full bg-[#FAF9F5] py-6 sm:py-10">
      <div className="w-full">
        <div className="grid overflow-hidden transition-shadow duration-500 lg:grid-cols-2">

          {/* Left Content - Maximum Width & Extra Padding */}
          <div className="flex flex-col justify-between bg-[#F07147] p-10 sm:p-16 md:p-20 lg:p-24 xl:p-32">

            {/* Heading */}
            <div>
              <span className="mb-6 inline-block text-base font-bold uppercase tracking-[0.4em] text-black/70 md:text-lg">
                Philosophy
              </span>

              <h2 className="font-serif text-5xl font-extrabold leading-[1.05] text-black sm:text-6xl md:text-7xl lg:text-8xl">
                The Art of <br />
                Slow Journey
              </h2>
            </div>

            {/* Quote */}
            <div className="my-12 border-l-4 border-black/80 pl-8 transition-colors duration-300 hover:border-black md:my-16 lg:my-20">
              <p className="font-serif text-2xl leading-relaxed italic md:text-3xl lg:text-4xl">
                "Slow travel is not just about the pace, but the
                presence—finding the pulse of a place in its silent,
                unhurried moments."
              </p>
            </div>

            {/* Description - Expanded text container */}
            <div className="space-y-8 md:space-y-10">
              <p className="max-w-3xl text-lg leading-relaxed text-black/85 md:text-xl lg:text-2xl">
                At <strong>The Drifting Quill</strong>, we believe meaningful
                travel begins when you stop rushing. Our stories celebrate
                mindful exploration, cultural immersion, and the timeless
                beauty found beyond crowded destinations.
              </p>

              <button className="group inline-flex w-fit items-center gap-4 rounded-full border-2 border-black px-10 py-5 text-xl font-semibold transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-2xl active:scale-95">
                Discover More
                <span className="text-2xl transition-transform duration-300 ease-out group-hover:translate-x-2">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* Right Image - Ultra Tall & Wide */}
          <div className="group relative min-h-[500px] overflow-hidden lg:min-h-[850px] xl:min-h-[950px]">

            <img
              src="https://static.wixstatic.com/media/c837a6_4840d34cc04342edaf75e059ee5478c5~mv2.jpg/v1/fill/w_768,h_961,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto/6ce3d41a-dd2c-4f20-81eb-76e70b4957f8.jpg"
              alt="Slow Travel"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500"></div>

            {/* Floating Card */}
            <div className="absolute bottom-10 left-10 right-10 max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-md transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:bg-white group-hover:shadow-3xl md:bottom-16 md:left-16">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 md:text-sm">
                Featured Story
              </p>

              <h3 className="mt-2 font-serif text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                Finding Peace in Motion
              </h3>

              <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
                Explore destinations through stories that value culture,
                sustainability, and unforgettable human connections.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JourneyComponent;