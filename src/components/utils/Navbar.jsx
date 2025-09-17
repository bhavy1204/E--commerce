import React from "react";
import { Search,User } from "lucide-react";
import logo from "../../assets/Untitled design.png"

export default function Navbar() {
    return (
        <>
            <nav className="flex bg-purple-500 px-5 py-3 justify-between gap-12 items-center">

                <div className="logo text-white font-bold text-2xl flex items-center gap-1">
                    <img src={logo} alt="" className="h-8 w-8 rounded-2xl"/>
                    <h1>Whimsy Weavers</h1>
                </div>

                <div className="nav-linnks flex gap-5 text-white font-semibold ">
                    <div className="home">
                        Home
                    </div>
                    <div className="home">
                        Contact
                    </div>
                    <div className="home">
                        products
                    </div>
                    <div className="home">
                        About
                    </div>
                </div>

                <div className="search rounded-2xl  bg-gray-300 px-2 py-1 items-center py-auto  ">
                    <div className="search flex ">

                        <Search className="text-sm" />
                        <input type="text" placeholder="search" className="align-middlen" />
                    </div>
                </div>

                 <div className="user">
                    <div className="text-sm text-white flex gap-1">
                        <User />
                        My account
                    </div>
                </div>
            </nav>
        </>
    )
}