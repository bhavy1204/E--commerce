import React, { useState } from "react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = form;

        const mailtoLink = `mailto:whimsyweaverss@gmail.com?subject=Message from ${encodeURIComponent(
            name
        )}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoLink;
    };

    return (
        <div className="flex items-center justify-center py-10 w-full flex-col">
            <h1 className="text-2xl font-bold text-purple-600 my-5">Contact us</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full md:w-1/2 px-10 py-10 gap-5 items-center"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="px-2 py-2 w-full border rounded-sm"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="px-2 py-2 w-full border rounded-sm"
                    required
                />

                <textarea
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                    className="px-2 py-2 w-full border rounded-sm h-32 resize-none"
                    required
                />

                <button className="bg-green-600 font-semibold py-2 rounded-md text-white w-1/3">
                    Send
                </button>
            </form>

            <div className="flex gap-6 mt-8 text-purple-700">
                <a
                    href="https://instagram.com/whimsy_weavers"
                    target="_blank"
                    className="underline"
                >
                    Instagram
                </a>

                <a
                    href="https://wa.me/+918005842524"
                    target="_blank"
                    className="underline"
                >
                    WhatsApp
                </a>

                <a
                    href="mailto:whimsyweaverss@gmail.com"
                    className="underline"
                >
                    Email
                </a>
            </div>

        </div>
    );
}
