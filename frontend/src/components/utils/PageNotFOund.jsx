import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
    const navigate = useNavigate();
    return (
        <>
            <div className="bg-purple-700 text-white h-screen flex items-center justify-center text-center px-4">
                <div className="mx-auto flex flex-col items-center max-w-lg">

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Error</h1>
                    <h1 className="text-5xl md:text-6xl font-semibold mb-8">404 Page Not Found</h1>

                    <h1 className="text-xl md:text-2xl font-semibold mb-4">
                        This Page is outside the universe!
                    </h1>

                    <p className="text-lg md:text-xl">
                        The page you are trying to access does not exist or has been moved.
                    </p>
                    <p className="text-lg md:text-xl mb-8">
                        Try going to the Homepage
                    </p>

                    <button
                        onClick={() => navigate("/home")}
                        className="rounded-sm text-gray-300 bg-purple-950 py-3 px-6 hover:bg-purple-900 transition"
                    >
                        Home page
                    </button>

                </div>
            </div>
        </>
    );
}
