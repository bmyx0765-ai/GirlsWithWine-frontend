"use client";

import { FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ServicesSection() {

  const router = useRouter();

  const services = [
    {
      title: "Call Girls",
      img: "/images/10.jpg",
      description:
        "Girls with Wine is an adult classified website for Call girls and women that can help you find single call girls and women.",
      cities: [
        {
          state: "karnataka",
          slug: "bangalore",
          name: "Bangalore Call Girls",
        },
        {
          state: "maharashtra",
          slug: "mumbai",
          name: "Mumbai Call Girls",
        },
        {
          state: "rajasthan",
          slug: "jaipur",
          name: "Jaipur Call Girls",
        },
      ],
    },
    {
      title: "Massage",
      img: "/images/11.jpg",
      description:
        "The best massage ads for all kinds of relaxing services. The massage girls provide a professional full-body massage experience.",
      cities: [
        {
          state: "haryana",
          slug: "gurugram",
          name: "Gurugram Massage",
        },
        {
          state: "madhya-pradesh",
          slug: "indore",
          name: "Indore Massage",
        },
        {
          state: "rajasthan",
          slug: "udaipur",
          name: "Udaipur Massage",
        },
      ],
    },
  ];

  const handleCityClick = (stateSlug, citySlug) => {
    router.push(`/call-girls/${stateSlug}/${citySlug}`);
  };

  return (
    <section className="w-full bg-[#E9F7FE] px-4 py-12">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-3xl font-extrabold text-[#A3195B]">
          Search Or Post Your Advertisements
        </h2>

        <div className="flex flex-wrap justify-center gap-8 mt-12">

          {services.map((service, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-md w-full sm:w-[340px]"
            >

              <Image
                src={service.img}
                alt={service.title}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />

              <p className="p-4 text-gray-700">
                {service.description}
              </p>

              <ul className="border-t">

                {service.cities.map((city) => (

                  <li
                    key={city.slug}
                    onClick={() =>
                      handleCityClick(city.state, city.slug)
                    }
                    className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                  >
                    {city.name}
                    <FiChevronRight />
                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}