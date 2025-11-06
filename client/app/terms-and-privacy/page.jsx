export default function TermsAndPrivacy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-50 to-white text-gray-800 py-12 px-6 lg:px-20">
      <section className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-yellow-700 mb-4">
          Terms & Privacy Policy
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Welcome to <strong>ReserveBeta</strong> — your trusted restaurant reservation and management platform.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-600">1. Introduction</h2>
          <p>
            By accessing or using <strong>ReserveBeta</strong>, you agree to comply with and be bound by
            these Terms and Conditions. Please read them carefully before using our services.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">2. Use of Service</h2>
          <p>
            ReserveBeta allows users to browse restaurants, make table reservations, and manage bookings.
            You agree to use the service only for lawful purposes and in compliance with all applicable laws.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">3. User Accounts</h2>
          <p>
            To access certain features, you may need to create an account. You are responsible for maintaining
            the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">4. Data Collection & Privacy</h2>
          <p>
            We respect your privacy. <strong>AreServeBeta</strong> collects only necessary information such as
            name, contact details, and reservation history to enhance your experience.  
            Your personal data will never be sold or shared with third parties without consent.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">5. Cookies</h2>
          <p>
            Our website and app may use cookies to improve usability and personalization.
            You can disable cookies in your browser settings, but some features may not function properly.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">6. Limitations of Liability</h2>
          <p>
            AreServeBeta is not responsible for any direct or indirect damages resulting from your use of
            our platform or reliance on any information provided by restaurants.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">7. Updates to This Policy</h2>
          <p>
            We may update these Terms and Privacy Policy periodically. Any changes will be posted here with
            a revised effective date.
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms or our Privacy Policy, please contact us at:<br />
            📧 <a href="mailto:support@areservebeta.com" className="text-blue-600 underline">support@areservebeta.com</a>
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          © {new Date().getFullYear()} AreServeBeta. All Rights Reserved.
        </p>
      </section>
    </main>
  );
}
