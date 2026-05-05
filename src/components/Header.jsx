"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiMail, FiBookOpen, FiHome } from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import Image from "next/image";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC] shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/images/girlswithwine.jpg"
              alt="logo"
              width={160}
              height={45}
              className="object-contain"
              unoptimized
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              href="/" 
              className="text-white text-sm font-bold uppercase tracking-widest hover:text-white/80 transition-all relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </Link>
            
            <Link 
              href="/contact" 
              className="text-white text-sm font-bold uppercase tracking-widest hover:text-white/80 transition-all relative group"
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </Link>

              <Link 
              href="/blog" 
              className="text-white text-sm font-bold uppercase tracking-widest hover:text-white/80 transition-all relative group"
            
            >
              Blog
             
            </Link>

            <Link 
              href="#" 
               className="bg-white text-[#00B9BE] px-6 py-2 rounded-full text-sm font-extrabold uppercase tracking-tighter hover:bg-opacity-90 shadow-md transition-all active:scale-95"
            >
              POST Your Ad
             
            </Link>

          
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={toggleDrawer(true)} 
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiMenu className="text-3xl" />
          </button>
        </div>
      </nav>

      {/* DRAWER (MOBILE MENU) */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: { width: "280px" }
        }}
      >
        <div className="h-full bg-gradient-to-br from-[#00B9BE] to-[#7CC7EC] flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/20">
            <span className="text-white font-black tracking-widest text-xl">MENU</span>
            <button onClick={toggleDrawer(false)} className="text-white hover:rotate-90 transition-transform duration-300">
              <FiX className="text-3xl" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col p-6 gap-4">
            <Link 
              href="/" 
              onClick={toggleDrawer(false)}
              className="flex items-center gap-4 text-white text-lg font-bold p-3 rounded-xl hover:bg-white/10 transition-all"
            >
              <FiHome className="text-xl" />
              Home
            </Link>

            <Link 
              href="/contact" 
              onClick={toggleDrawer(false)}
              className="flex items-center gap-4 text-white text-lg font-bold p-3 rounded-xl hover:bg-white/10 transition-all"
            >
              <FiMail className="text-xl" />
              Contact Us
            </Link>

             <Link 
              href="/blog" 
               className="flex items-center gap-4 text-white text-lg font-bold p-3 rounded-xl hover:bg-white/10 transition-all"
            >
              <FiMail className="text-xl" />
              Blog
             
            </Link>

             <Link 
              href="/blog" 
               className="bg-white text-[#00B9BE] px-6 py-2 rounded-full text-sm font-extrabold uppercase tracking-tighter hover:bg-opacity-90 shadow-md transition-all active:scale-95"
            >
              POST Your Ad
             
            </Link>
          </div>

          {/* Drawer Footer */}
          <div className="mt-auto p-8 text-center border-t border-white/10">
             <p className="text-white/60 text-xs font-medium italic">
               © 2026 Girls With Wine
             </p>
          </div>
        </div>
      </Drawer>

      {/* Spacer so content doesn't hide under the fixed nav */}
      <div className="h-16 sm:h-20" />
    </>
  );
}