// "use client";
// import React from "react";

// const GirlsPrice = () => {
//   const pricing = [
//     { duration: "1 Hour", regular: "₹2999", independent: "₹3999", vip: "₹5999" },
//     { duration: "2 Hours", regular: "₹4999", independent: "₹6999", vip: "₹9999" },
//     { duration: "Full Night", regular: "₹9999", independent: "₹14999", vip: "₹19999" },
//     {
//       duration: "Customized Hours",
//       regular: "Contact Us",
//       independent: "Contact Us",
//       vip: "Contact Us",
//     },
//   ];

//   return (
//     <section className="py-20 px-4 ">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl md:text-4xl font-bold text-center text-[#9772ED] mb-12">
//           Pricing Transparency
//         </h2>

//         <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
//           Girls With Wine uses a transparent payment process, ensuring a clear
//           confirmation before booking. No misleading offers are suggested.
//           Instead, clarity is provided of escort charges according to the
//           profile, location, and time selected by a client.
//         </p>

//         <div className="overflow-x-auto">
//           <table className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
//             <thead>
//               <tr className="bg-gradient-to-r from-[#735DA5] to-[#9479D4] text-white">
//                 <th className="px-8 py-6 text-xl font-bold">Duration</th>
//                 <th className="px-8 py-6 text-xl font-bold">Regular Escorts</th>
//                 <th className="px-8 py-6 text-xl font-bold">
//                   Independent Escorts
//                 </th>
//                 <th className="px-8 py-6 text-xl font-bold">VIP Escorts</th>
//               </tr>
//             </thead>

//             <tbody>
//               {pricing.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className="hover:bg-[#352064] hover:text-white transition-colors duration-200 border-b border-gray-100"
//                 >
//                   <td className="px-8 py-6 font-semibold text-black hover:text-[#ffffff]">
//                     {row.duration}
//                   </td>

//                   <td className="px-8 py-6 font-bold text-2xl text-green-600">
//                     {row.regular}
//                   </td>

//                   <td className="px-8 py-6 font-bold text-2xl text-blue-600">
//                     {row.independent}
//                   </td>

//                   <td className="px-8 py-6 font-bold text-2xl text-purple-600">
//                     {row.vip}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default GirlsPrice;







"use client";
import React from "react";

const GirlsPrice = () => {
  const pricing = [
    { duration: "1 Hour", regular: "₹2999", independent: "₹3999", vip: "₹5999" },
    { duration: "2 Hours", regular: "₹4999", independent: "₹6999", vip: "₹9999" },
    { duration: "Full Night", regular: "₹9999", independent: "₹14999", vip: "₹19999" },
    { duration: "Customized Hours", regular: "Contact Us", independent: "Contact Us", vip: "Contact Us" },
  ];

  return (
    <section className="py-20 px-4 bg-[#F9F9F9]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#735DA5] mb-12">
          Pricing Transparency
        </h2>

        <p className="text-xl text-[#343338] text-center max-w-3xl mx-auto mb-16 leading-relaxed">
          Girls With Wine uses a transparent payment process, ensuring a clear
          confirmation before booking.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-3xl shadow-lg border border-[#6A5796]/20 overflow-hidden">
            <thead>
              <tr className="bg-[#3D3948] text-white">
                <th className="px-8 py-6 text-xl font-bold text-left">Duration</th>
                <th className="px-8 py-6 text-xl font-bold">Regular Escorts</th>
                <th className="px-8 py-6 text-xl font-bold">Independent</th>
                <th className="px-8 py-6 text-xl font-bold">VIP Escorts</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#4F4567] group transition-colors duration-300 border-b border-[#E5E7EB]"
                >
                  <td className="px-8 py-6 font-semibold text-[#3D3948] group-hover:text-white">
                    {row.duration}
                  </td>
                  <td className="px-8 py-6 font-bold text-2xl text-[#6A5796] text-center group-hover:text-white">
                    {row.regular}
                  </td>
                  <td className="px-8 py-6 font-bold text-2xl text-[#615186] text-center group-hover:text-white">
                    {row.independent}
                  </td>
                  <td className="px-8 py-6 font-bold text-2xl text-[#735DA5] text-center group-hover:text-white">
                    {row.vip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default GirlsPrice;