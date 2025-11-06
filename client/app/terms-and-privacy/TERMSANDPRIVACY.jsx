export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-200 text-gray-800">
      <section className="py-20 px-10 text-center">
        <h1 className="text-5xl font-bold mb-8">Terms & Conditions</h1>
        <div className="max-w-3xl mx-auto text-left space-y-5 text-lg leading-relaxed">
          <p>
            Welcome to <strong>ReserveBeta</strong>. By using our platform, you agree to comply with and be bound by
            the following terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Use of Service</h2>
          <p>
            You must use the platform responsibly and avoid making fake or multiple reservations.
            Misuse may result in suspension or termination of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. Reservations</h2>
          <p>
            All bookings are subject to restaurant availability. We strive to keep real-time updates but do not
            guarantee that all listed availability is accurate.
          </p>

          <h2 className="text-2xl font-semibold mt-6">3. Privacy Policy</h2>
          <p>
            We value your privacy. Any personal data collected will be handled responsibly and only used to improve
            your experience. For full details, please review our Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Changes to Terms</h2>
          <p>
            <strong>ReserveBeta</strong> reserves the right to update or modify these terms at any time. Continued
            use of the platform after updates implies acceptance.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Contact</h2>
          <p>
            For any questions about these Terms, please reach out via our official Contact page.
          </p>
        </div>
      </section>
    </div>
  );
}
