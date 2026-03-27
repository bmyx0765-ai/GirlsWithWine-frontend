




"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getCitiesThunk } from "@/store/slices/citySlice";

export default function HeroSection() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cities } = useSelector((s) => s.city);

  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  const makeSlug = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "";

const handleSearch = () => {
    if (!selectedCity) return;

    console.log("SELECTED SLUG:", selectedCity); // ✅ debug

    router.push(`/${selectedCity}`); // ✅ DIRECT SLUG
  };
 return (

//   <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] overflow-hidden">

//   {/* BACKGROUND IMAGE */}
//   <div className="absolute inset-0">
//     <img
//       src="/images/call-girls-girlswithwine-banner.webp"
//       alt=""
//       className="w-full h-full object-cover"
//     />
//     {/* DARK OVERLAY (important for text visibility) */}
//     <div className="absolute inset-0 bg-black/50"></div>
//   </div>

//   {/* CONTENT */}
//   <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 flex flex-col items-center justify-center text-center">

//     {/* TITLE */}
//     <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-white">
//       Welcome to{" "}
//       <span className="text-[#A01047] drop-shadow-md">
//         Girls with Wine
//       </span>
//     </h1>

//     {/* SUBTITLE */}
//     <p className="mt-4 text-white/90 text-sm sm:text-lg max-w-xl sm:max-w-2xl">
//       Explore premium listings across India in a simple and seamless way.
//     </p>

//     {/* SEARCH BOX */}
//     <div className="mt-8 w-full max-w-xl sm:max-w-2xl">

//       <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl border border-white/30 p-3 flex flex-col sm:flex-row gap-3">

//         {/* SELECT */}
//         <select
//           value={selectedCity}
//           onChange={(e) => setSelectedCity(e.target.value)}
//           className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none text-sm sm:text-base"
//         >
//           <option value="">Select City</option>
//           {cities?.map((c) => (
//             <option key={c._id} value={c.slug}>
//               {c.mainCity}
//             </option>
//           ))}
//         </select>

//         {/* BUTTON */}
//         <button
//           onClick={handleSearch}
//           className="w-full sm:w-auto bg-[#A01047] hover:bg-[#850c3a] text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
//         >
//           Search Now
//         </button>

//       </div>

//     </div>

//   </div>
// </section>


  <section className="relative min-h-[500px] w-full overflow-hidden">

    {/* BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC]" />

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-20"
      style={{
        backgroundImage: "url('/images/heroimagebackground.png')"
      }}
    />

    {/* RIGHT IMAGE */}
    <div
      className="hidden lg:block absolute right-0 bottom-0 h-full w-[40%] xl:w-[45%] bg-contain bg-no-repeat bg-right-bottom opacity-90"
      style={{
        backgroundImage:
          "url('https://in.tottaa.com/uploads/cms-pages/oS9aBkeg59tCX1HTHy5YIb3ttx3VeG42veJZLDj2.png')",
      }}
    />

    {/* CONTENT */}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 flex flex-col items-center text-center">

      {/* TITLE */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
        Welcome to{" "}
        <span className="text-[#A01047] drop-shadow-md">
          Girls with Wine
        </span>
      </h1>

      {/* SUBTITLE */}
      <p className="mt-4 text-white/90 text-lg sm:text-xl max-w-2xl">
        Explore premium listings across India in a simple and seamless way.
      </p>

      {/* SEARCH BOX */}
      <div className="mt-10 w-full max-w-2xl">

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-3 flex flex-col sm:flex-row gap-3 items-center">

          {/* SELECT */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none "
          >
            <option value="">Select City</option>
            {cities?.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.mainCity}
              </option>
            ))}
          </select>

          {/* BUTTON */}
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#A01047] hover:bg-[#850c3a] text-white px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
          >
            Search Now
          </button>

        </div>

      </div>

    </div>
  </section>



  
  

);
}