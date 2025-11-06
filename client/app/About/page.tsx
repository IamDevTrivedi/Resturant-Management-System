export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-200 text-gray-800">
      
      {/* About Section */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">About Our Platform</h1>
        <p className="max-w-2xl text-lg leading-relaxed">
          Welcome to <strong>ReserveBeta</strong> — your trusted partner for effortless restaurant bookings.
          We connect diners with the best restaurants in town, offering real-time reservations,
          instant confirmations, and a smooth dining experience.
        </p>
      </section>

      {/* Mission Section */}
      <section className="flex flex-col items-center justify-center text-center px-10 pb-20">
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="max-w-2xl text-lg leading-relaxed">
          To make dining simple, delightful, and accessible for everyone.
          No more long waits, no more confusion — just great food and perfect timing.
        </p>
      </section>

      {/* Team Section */}
      <section className="bg-yellow-100 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-8">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: 'ANUSHKA RAWAT', role: 'UI/UX Designer' },
          ].map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-yellow-200 text-yellow-800 text-3xl font-bold mb-4">
                {person.name[0]}
              </div>
              <h3 className="text-xl font-semibold">{person.name}</h3>
              <p className="text-sm text-gray-600">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
