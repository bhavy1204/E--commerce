import React from "react";

export const Customisation = () => {
  return (
    <div className="min-h-screen px-4 md:px-20 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-8 text-purple-900 border-b pb-4">
          Customisation Available
        </h1>

        <div className="space-y-8">
          <section>
            <p className="text-gray-600 leading-relaxed">
              Every piece at Whimsy Weaver is handmade with love, and you can
              make it truly yours 🤍 We offer customisation options so your
              order feels personal, meaningful, and one of a kind. What You Can
              Customise:
            </p>

            <div className="ml-3">
              <li className="text-gray-600 leading-relaxed mt-3">
                🎨 Colours of your choice
              </li>
              <li className="text-gray-600 leading-relaxed">
                📏 Size (minor adjustments as per requirement)
              </li>
              <li className="text-gray-600 leading-relaxed">
                ✍️ Name / Initials / Short Words
              </li>
              <li className="text-gray-600 leading-relaxed">
                🧵 Design details (small changes in patterns or elements)
              </li>
              <li className="text-gray-600 leading-relaxed">
                🎁 Occasion-based customisation (birthdays, gifts, festivals,
                anime-inspired themes)
              </li>
              <li className="text-gray-600 leading-relaxed">
                🌟 Full Custom Pieces (New Designs)
              </li>
            </div>

            <div className="my-6">
              <p className="text-gray-600 leading-relaxed">
                Have something in mind that’s not listed on our website or
                something we’ve never made before? We accept full custom orders,
                where your idea becomes a completely new handmade piece ✨ You
                can share:
              </p>
            </div>
          </section>

          <div className="mt-3 ml-3">
            <li className="text-gray-600 leading-relaxed">Reference images</li>
            <li className="text-gray-600 leading-relaxed">
              Your concept or idea
            </li>
            <li className="text-gray-600 leading-relaxed">
              Colour preferences
            </li>
            <li className="text-gray-600 leading-relaxed">
              Size and purpose of the piece
            </li>
          </div>

          <section>
            <p className="text-gray-600 leading-relaxed">
              We’ll discuss feasibility, pricing, and timelines before
              confirming the order. How It Works: Select “Customisation” while
              placing your order or contact us directly Share your preferences
              in the notes section We’ll connect with you on Instagram /
              WhatsApp to finalise details Your personalised piece will be
              handcrafted just for you 💫
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              Please Note: Custom & full custom orders require extra creation
              time Advance payment is required for full custom pieces Customised
              products are non-returnable Pricing may vary depending on
              complexity and materials.
            </p>

            <p className="text-gray-700 leading-relaxed mt-3">
              Not sure where to start? DM us on Instagram{" "}
              <a
                href="https://instagram.com/whimsy_weavers"
                className="text-blue-700"
              >
                @whimsyweaver{" "}
              </a>
              and let’s create something magical together 💖
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
