import React from 'react';

export const ShippingPolicy = () => {
    return (
      <div className="min-h-screen px-4 md:px-20 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold mb-8 text-purple-900 border-b pb-4">
            Shipping Policy
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-purple-800">
                Processing & Shipping
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Processing Time
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All products are handcrafted and require up to 7 business days
                  for production before they are shipped.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Shipping Time
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  After dispatch, standard shipping takes approximately 7
                  business days (excluding Saturdays and Sundays), depending on
                  the delivery location. Express shipping takes approximately 2
                  business days after dispatch.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Estimated Total Delivery Time
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The estimated total delivery time is up to 14 business days
                  for standard shipping (7 days production + 7 days shipping).
                  For express shipping, the estimated total delivery time is up
                  to 9 business days (7 days production + 2 days shipping).
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tracking details will be shared via email once your order has
                been dispatched.
              </p>
            </section>
          </div>
        </div>
      </div>
    );

};
