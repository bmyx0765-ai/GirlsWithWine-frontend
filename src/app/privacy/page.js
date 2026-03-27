export const metadata = {
  title: "Privacy Policy | Girls With Wine",
  description:
    "Read the Privacy Policy of Girls With Wine Network to understand how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://girlswithwine.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy({ lastUpdated = "December 2025" }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8">

        {/* Last Updated */}
        <div className="mb-10">
          <p className="text-sm text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* PRIVACY POLICY CONTENT */}
        <section
          className="
          prose prose-sm lg:prose-lg text-gray-700 leading-relaxed
          [&_p]:text-gray-700 [&_p]:text-base [&_p]:mb-4
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#A3195B] [&_h2]:mt-8 [&_h2]:mb-3
          [&_ul]:list-disc [&_ul]:pl-6
        "
        >
          <p>
            We are dedicated to protecting the personal information of all
            users and advertisers who interact with our platform. In order to
            comply with applicable Data Protection Laws, every piece of data
            you share with us is managed with strict confidentiality and used
            only for legitimate operational purposes.
          </p>

          <p>
            While we take full responsibility for safeguarding the information
            you provide privately, any details an Offeror User chooses to make
            public on their profile remain under their own control, and the
            platform cannot be held liable if such openly shared information
            is accessed or misused by unintended parties.
          </p>

          <p>
            This Privacy Policy may be modified occasionally to align with new
            legal requirements or regulatory directives, and any important
            updates will be communicated through revised links or on-site
            notices.
          </p>

          <h2>Information We Collect</h2>

          <p>
            The information we collect may include personal details such as
            your name, phone number, email address, and identification
            documents, as well as payment-related data such as your
            transaction history and purchase records.
          </p>

          <p>
            You may also voluntarily provide additional details like your age,
            gender, profile images, or other information you choose to share.
            In some cases, preference-based categories may be collected if
            you submit them willingly.
          </p>

          <p>
            Technical information may also be gathered automatically,
            including your IP address, device type, browser information,
            and cookie data. Non-identifiable aggregated data may be gathered
            to help us understand user behavior and improve the performance
            of our services.
          </p>

          <h2>How We Use Your Information</h2>

          <p>
            Your personal information is used for several lawful purposes,
            including enabling account creation, allowing smooth use of the
            website, communicating with other users, publishing
            advertisements, and completing verification requirements.
          </p>

          <p>
            It also helps us process payments, send promotional messages
            (when you consent), improve our services through analytics,
            prevent fraud or misuse, and comply with legal obligations.
          </p>

          <h2>Data Protection & Security</h2>

          <p>
            To protect your information, we rely on multiple security
            measures such as encrypted systems, secure servers, and
            restricted access controls to prevent unauthorized access.
          </p>

          <p>
            We retain your information only for the duration necessary
            for its intended purpose. Account and browsing data may be
            stored for up to two years of inactivity, advertisement data
            for one year after expiration, and verification records for
            one year after account deletion.
          </p>

          <p>
            Transaction records may be stored for up to ten years as
            required by applicable financial and legal regulations.
          </p>

          <h2>Data Sharing</h2>

          <p>
            Your information may only be accessed by authorized employees
            or trusted third-party service providers who assist us with
            tasks such as technical support, identity verification,
            analytics, or legal compliance.
          </p>

          <p>
            You may request a list of these external service providers
            at any time.
          </p>

          <h2>Your Rights</h2>

          <p>
            As a user, you have the right to request access to your data,
            request corrections, withdraw consent for certain processing
            activities, and file complaints with the appropriate
            regulatory authority.
          </p>

          <p>
            Requests related to personal data can be submitted through
            our support contact at any time without charge.
          </p>

          <p className="mt-8 text-gray-600 italic">
            © 2025 Girls With Wine. All Rights Reserved.
          </p>
        </section>
      </div>
    </div>
  );
}