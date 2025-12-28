import React from 'react';

export const RefundPolicy = () => {
    return (
        <div className="min-h-screen px-4 md:px-20 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
                <h1 className="text-4xl font-bold mb-8 text-purple-900 border-b pb-4">Cancellation and Refund Policy</h1>

                <div className="space-y-8 text-gray-600 leading-relaxed">

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="font-semibold text-red-700">Please Read Carefully</p>
                        <p className="text-sm text-red-600 mt-1">We maintain a strict no-refund policy to ensure quality and efficiency.</p>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-purple-800">Cancellations</h2>
                        <p>
                            Orders once placed <strong>cannot be cancelled</strong> or modified. Please review your order details carefully before confirming your purchase. We process orders immediately to ensure timely delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-purple-800">Refunds & Returns</h2>
                        <p className="mb-4">
                            We do <strong>not</strong> offer refunds or returns on any products sold. All sales are final.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-purple-800">Damaged or Wrong Products</h2>
                        <p className="mb-4">
                            In the unlikely event that you receive a wrong product or a damaged item, we will consider it for review ONLY if the following condition is met:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 bg-gray-50 p-4 rounded-md">
                            <li>
                                You must record a <strong>clear, unedited unboxing video</strong> showing the parcel being opened and the product's condition.
                            </li>
                            <li>
                                The video must be shared with our support team within <strong>24 hours</strong> of delivery.
                            </li>
                        </ul>
                        <p className="mt-4">
                            Upon verification of the video, if the claim is found to be genuine, we will take appropriate action to resolve the issue. Without an unboxing video, no complaints will be entertained.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};
