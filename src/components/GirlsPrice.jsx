"use client";
import React from "react";

const GirlsPrice = () => {
  const pricing = [
    { duration: "1 Hour", regular: "₹2999", independent: "₹3999", vip: "₹5999" },
    { duration: "2 Hours", regular: "₹4999", independent: "₹6999", vip: "₹9999" },
    { duration: "Full Night", regular: "₹9999", independent: "₹14999", vip: "₹19999" },
    {
      duration: "Customized Hours",
      regular: "Contact Us",
      independent: "Contact Us",
      vip: "Contact Us",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#A3195B] mb-12">
          Pricing Transparency
        </h2>

        <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
          Girls With Wine uses a transparent payment process, ensuring a clear
          confirmation before booking. No misleading offers are suggested.
          Instead, clarity is provided of escort charges according to the
          profile, location, and time selected by a client.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC] text-white">
                <th className="px-8 py-6 text-xl font-bold">Duration</th>
                <th className="px-8 py-6 text-xl font-bold">Regular Escorts</th>
                <th className="px-8 py-6 text-xl font-bold">
                  Independent Escorts
                </th>
                <th className="px-8 py-6 text-xl font-bold">VIP Escorts</th>
              </tr>
            </thead>

            <tbody>
              {pricing.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100"
                >
                  <td className="px-8 py-6 font-semibold text-gray-800">
                    {row.duration}
                  </td>

                  <td className="px-8 py-6 font-bold text-2xl text-green-600">
                    {row.regular}
                  </td>

                  <td className="px-8 py-6 font-bold text-2xl text-blue-600">
                    {row.independent}
                  </td>

                  <td className="px-8 py-6 font-bold text-2xl text-purple-600">
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