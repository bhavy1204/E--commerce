import React from 'react';

export const ShippingPolicy = () => {
    return (
        <div className="min-h-screen px-4 md:px-20 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
                <h1 className="text-4xl font-bold mb-8 text-purple-900 border-b pb-4">Shipping Policy</h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-purple-800">Processing & Shipping</h2>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Processing Time</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Standard orders: 7 working days (excluding saturdays and sundays)
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Custom orders: upto 10 working days for processing
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Shipping Time</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Once shipped, it will take 4-6 working days (excluding saturdays and sundays), depending on your location
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Tracking</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Tracking details will be sent to you via email as soon as your order is dispatched.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Operating Hours</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our warehouse operates Monday to Saturday from 10:00 AM to 6:00 PM
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
