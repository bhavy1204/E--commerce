import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function PageNotFound() {
    const navigate = useNavigate();
    return (
        <>
            <div className="bg-purple-700 text-white h-screen no-scrollbar overflow-y-clip">
                <div className=" mx-auto flex justify-center flex-col items-center">
                    <div className="content m-30 flex flex-col items-center">
                        <h1 className="text-5xl font-bold mb-8">Error</h1>
                        <h1 className="text-6xl font-semibold mb-10">404 Page not Found</h1>
                        <h1 className="text-2xl font-semibold mb-5" >This Page is outside universe!</h1>
                        <p className="text-xl "  >The page you are trying to access does not access or has been moved.</p>
                        <p className="text-xl mb-10"  >trying going to Homepage</p>
                        <button onClick={()=> navigate("/home")} className="rounded-sm text-gray-300 bg-purple-950 py-3 px-6"  >Home page</button>
                    </div>

                </div>
            </div>
        </>
    )
}