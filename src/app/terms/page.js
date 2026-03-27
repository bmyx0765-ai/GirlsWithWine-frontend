export const metadata = {
  title: "Terms and Conditions | Girls With Wine",
  description:
    "Read the Terms and Conditions for using Girls With Wine Network, India's private classified advertising platform.",
  alternates: {
    canonical: "https://girlswithwine.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditions({
  lastUpdated = "August 2025",
  jurisdiction = "India",
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto p-8">

        <div className="mb-10">
          <p className="text-sm text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <section className="prose prose-sm lg:prose-lg text-gray-700 leading-relaxed [&_p]:text-gray-700 [&_p]:text-base [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#A3195B] [&_h2]:mt-8 [&_h2]:mb-3">

          <p>
            Welcome to Girls With Wine. By accessing or using our website
            (https://girlswithwine.com), you agree to comply with and be bound
            by the Terms and Conditions described below.
          </p>

          <p>
            We act only as a digital advertising platform and do not employ,
            manage, verify, schedule, or coordinate interactions between users.
            All listings are user-generated, and all communications occur
            directly between users.
          </p>

          <h2>1. Platform Purpose</h2>
          <p>
            This platform provides a space for independent providers to
            advertise their services. We operate strictly as a listing platform
            and do not participate in arrangements made between users.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            To use this platform, you must be at least 18 years old or meet the
            legal age of majority in your jurisdiction.
          </p>

          <p>
            By creating an account or posting content, you confirm that you meet
            legal requirements and that accessing such a platform is permissible
            in your location.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>
            Users must behave respectfully and responsibly. All posted
            information must be truthful, current, and accurate.
          </p>

          <h2>4. Prohibited Content</h2>

          <ul>
            <li>Content involving minors</li>
            <li>Non-consensual or exploitative material</li>
            <li>Threats, harassment, or hate speech</li>
            <li>Illegal goods or services</li>
            <li>Copyright or intellectual property violations</li>
          </ul>

          <p>
            Violations may result in immediate removal and account suspension.
          </p>

          <h2>5. Age Verification Procedure</h2>

          <p>
            Service providers may undergo age verification through automated or
            manual checks.
          </p>

          <h2>6. Acceptable Use Policy</h2>

          <p>
            Users must not upload unlawful, offensive, or fraudulent material.
          </p>

          <h2>7. Content Ownership and Usage</h2>

          <p>
            Users retain ownership of their content but grant the platform a
            license to display and distribute it for operational purposes.
          </p>

          <h2>8. Third-Party Content</h2>

          <p>
            Our website may display third-party advertisements or links. We do
            not control or endorse external content.
          </p>

          <h2>9. No Guarantee of Services</h2>

          <p>
            Listings are user-generated and we do not guarantee the accuracy or
            reliability of advertised services.
          </p>

          <h2>10. Payment and Refund Policy</h2>

          <p>
            Some listings may require payment for promotion. Paid listings are
            non-refundable except for technical failures.
          </p>

          <h2>11. Account Suspension or Termination</h2>

          <p>
            Accounts violating platform policies may be suspended or permanently
            removed.
          </p>

          <h2>12. Legal Compliance</h2>

          <p>
            Users must comply with the Information Technology Act (2000) and
            applicable Indian laws.
          </p>

          <h2>13. Limitation of Liability</h2>

          <p>
            We are not responsible for losses resulting from use of the
            platform.
          </p>

          <h2>14. Indemnification</h2>

          <p>
            Users agree to indemnify the platform from claims resulting from
            misuse of the service.
          </p>

          <h2>15. Modifications to Terms</h2>

          <p>
            We may update these Terms at any time. Continued use of the platform
            constitutes acceptance of changes.
          </p>

          <h2>16. Privacy Policy</h2>

          <p>
            Our Privacy Policy explains how personal information is collected
            and used.
          </p>

          <h2>17. Contact Information</h2>

          <p>
            Email:{" "}
            <a
              href="mailto:info@girlswithwine.com"
              className="text-blue-600"
            >
              info@girlswithwine.com
            </a>
            <br />
            Phone: +91 9000000000
          </p>

          <p>© 2025 Girls With Wine. All Rights Reserved.</p>

        </section>
      </div>
    </div>
  );
}