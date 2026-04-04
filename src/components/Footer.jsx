"use client";

import React from "react";
import { FaArrowUp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP GRID */}
        <div className="grid md:grid-cols-4 gap-16">

          {/* COLUMN 1 */}
          <div className="pr-8">
            <Link href="/">
              <Image
                src="/images/LOGO.PNG"
                alt="Girls with Wine Logo"
                width={240}
                height={80}
                className="w-60 object-contain mb-5"
              />
            </Link>

            <p className="text-[15px] leading-relaxed opacity-90 max-w-sm">
              The number 1 website for Adult ADS in India for Female Escorts
              and massage ads.
            </p>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h2 className="font-semibold text-[20px] mb-6">Girls With Wine</h2>
            <ul className="space-y-3 text-[15px] opacity-90">
              <li>
                <Link href="/" className="hover:text-gray-300">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-300">About Us</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h2 className="font-semibold text-[20px] mb-6">HELP / INFO</h2>
            <ul className="space-y-3 text-[15px] opacity-90">
              <li>
                <Link href="/terms" className="hover:text-gray-300">
                  Terms And Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 */}
          <div>
            <h2 className="font-semibold text-[20px] mb-6">USEFUL LINKS</h2>

            <ul className="space-y-3 text-[15px] opacity-90">
              <li>
                <Link href="/contact" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>

              <li>

                <Link href="/blog" className="hover:text-gray-300">
                  Blog
                </Link>

              </li>
            </ul>

            <Image
              src="/images/RTA.png"
              alt="RTA Badge"
              width={220}
              height={100}
              className="w-56 mt-3 ml-2"
            />
          </div>
        </div>

        {/* DISCLAIMER */}
        <p className="text-center text-[14px] mt-16 leading-relaxed opacity-60 max-w-4xl mx-auto">
          Girls With Wine facilitates connections strictly for individuals who
          are above 18 years. We never promote or get involved in illegal
          activities. Coupling is based on mutual consent without emotional
          pressure.
        </p>

        {/* COPYRIGHT */}
        <div className="mt-12 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Girls with Wine — All Rights Reserved
          </p>

          <button className="flex items-center gap-2 bg-pink-700 hover:bg-pink-600 px-5 py-2 rounded-full text-sm font-medium">
            🌐 Girls with Wine Network
          </button>
        </div>
      </div>

      {/* SCROLL TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-pink-700 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;