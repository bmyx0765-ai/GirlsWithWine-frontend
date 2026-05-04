"use client";

import React from "react";
import { 
  FaArrowUp, 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebookF, 
  FaTwitter 
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The phone number must include the country code without '+' or '00'
  const whatsappNumber = "91XXXXXXXXXX"; // Replace with your actual number

  const socialLinks = [
    { 
      icon: <FaWhatsapp />, 
      // Using direct WhatsApp API link with a standard <a> tag
      href: `https://wa.me/${whatsappNumber}`, 
      label: "WhatsApp",
      hoverClass: "hover:bg-green-500 hover:border-green-500",
      isExternal: true 
    },
    { 
      icon: <FaInstagram />, 
      href: "https://www.instagram.com/girlswithwine01/", 
      label: "Instagram",
      hoverClass: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 hover:border-transparent",
      isExternal: true
    },
    { 
      icon: <FaFacebookF />, 
      href: "https://www.facebook.com/share/1CUFEsWxLk/", 
      label: "Facebook",
      hoverClass: "hover:bg-blue-600 hover:border-blue-600",
      isExternal: true
    },
    { 
      icon: <FaTwitter />, 
      href: "https://x.com/GirlsWithWine0", 
      label: "Twitter",
      hoverClass: "hover:bg-sky-500 hover:border-sky-500",
      isExternal: true
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="space-y-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/images/LOGO.PNG"
                alt="Logo"
                width={200}
                height={60}
                className="w-48 object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              India&apos;s premier destination for adult classifieds. 
              We provide a safe, discreet, and premium platform.
            </p>

            {/* SOCIAL ICONS ROW */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  rel="nofollow"
                  target="_blank"
                 
                  className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-lg transition-all duration-300 bg-white/5 ${social.hoverClass} hover:text-white hover:-translate-y-1 shadow-lg`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-[15px]">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-[15px]">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-[15px]">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-[15px]">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Useful Links</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-[15px]">Contact Support</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-[15px]">Latest Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-4xl mx-auto italic">
            Disclaimer: Girls With Wine facilitates connections strictly for individuals 18+. 
            We maintain a zero-tolerance policy for illegal activities. All interactions are 
            governed by mutual consent and adult autonomy.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 tracking-wider">
            © {new Date().getFullYear()} GIRLS WITH WINE. ALL RIGHTS RESERVED.
          </p>

          <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all hover:shadow-[0_0_20px_rgba(219,39,119,0.4)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            NETWORK STATUS
          </button>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-8 right-8 bg-pink-600 hover:bg-pink-500 text-white p-4 rounded-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 group z-50"
      >
        <FaArrowUp className="text-lg group-hover:animate-bounce" />
      </button>
    </footer>
  );
};

export default Footer;