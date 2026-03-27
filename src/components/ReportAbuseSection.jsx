import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function ReportAbuseSection() {
  return (
    <div className="w-full bg-[#fdfdfd] py-10 px-4 md:px-0 flex flex-col items-center">

      {/* REPORT ABUSE BOX */}
      <div className="max-w-7xl w-full bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-10 h-10 text-[#A3195B]" />

          <h2 className="text-2xl font-bold text-[#c00b5a]">
            Report Abuse
          </h2>
        </div>

        <ul className="mt-4 space-y-3 text-gray-700 text-[16px] leading-relaxed ml-12">
          <li className="list-disc">
            If you come across any inappropriate usage of photos or intellectual
            property (such as names, addresses, phone numbers, or email
            addresses), you can report it by sending an email to
            report@girlswithwine.com.
          </li>

          <li className="list-disc">
            If you come across any content that you think is unlawful or harmful,
            you may report it by sending an email to report@girlswithwine.com.
          </li>
        </ul>
      </div>

      {/* SECURITY WARNING */}
      <div className="max-w-7xl w-full mt-6">
        <div className="flex items-center gap-2 px-4 mb-[-10px]">
          <span className="px-4 py-1 bg-pink-100 rounded-full text-[#760025] font-semibold text-sm">
            SECURITY TIPS
          </span>
        </div>

        <div className="bg-[#a0003c] text-white text-center py-4 px-6 rounded-lg font-semibold text-[15px] md:text-[16px]">
          Be wary of con artists requesting money while pretending to be Girls
          With Wine. Girls With Wine will not pursue payment from you in any way.
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="max-w-7xl w-full mt-12">

        <h2 className="text-3xl md:text-4xl font-extrabold text-[#A3195B] mb-4">
          Girls With Wine Disclaimer & User Responsibility Statement
        </h2>

        <p className="text-gray-700 text-[16px] leading-relaxed mb-4">
          By using our site and providing feedback, the user indicates their
          agreement to our Terms & Conditions. The advertiser takes full
          responsibility for placing ads on Girls With Wine. We do not
          necessarily verify all advertisement content before publishing.
        </p>

        <p className="text-gray-700 text-[16px] leading-relaxed">
          We take no responsibility for advertisers’ adherence to public or
          moral standards, intellectual property rights, or other ethical
          issues. Girls With Wine provides a platform for posting ads and
          browsing listings but does not mediate disputes between advertisers
          and customers.
        </p>

      </div>

    </div>
  );
}