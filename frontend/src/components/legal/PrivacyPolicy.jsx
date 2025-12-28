import React from 'react';

export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen px-4 md:px-20 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
                <h1 className="text-4xl font-bold mb-8 text-purple-900 border-b pb-4">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p className="italic text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        At Whimsy Weavers, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Whimsy Weavers and how we use it.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-800">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you register an account, place an order, subscribe to our newsletter, or contact us. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Name, email address, phone number, and shipping address.</li>
                        <li>Payment information (processed securely by our payment partners).</li>
                        <li>Order history and preferences.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-800">2. How We Use Your Information</h2>
                    <p>We use the information we collect in various ways, including to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Process and deliver your orders.</li>
                        <li>Send you order confirmations and updates (via Email/SMS).</li>
                        <li>Improve, personalize, and expand our website.</li>
                        <li>Communicate with you regarding updates, offers, and customer service.</li>
                        <li>Detect and prevent fraud.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-800">3. Third-Party Services</h2>
                    <p>
                        We may share your data with trusted third-party services essential for our operations, such as:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Payment Gateways:</strong> Razorpay (for secure payment processing).</li>
                        <li><strong>Shipping Partners:</strong> To deliver your products.</li>
                        <li><strong>Communication Tools:</strong> Resend/Email services for notifications.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-800">4. Data Security</h2>
                    <p>
                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. However, remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-800">5. Contact Us</h2>
                    <p>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:whimsyweaverss@gmail.com" className="text-purple-600 hover:underline">whimsyweaverss@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};
