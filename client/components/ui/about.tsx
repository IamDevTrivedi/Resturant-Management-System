'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-80vh mt-20 mb-20 px-6 py-10 text-white-800">
      <section className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-15 text-#f4b968">About Our Restaurant Reservation System</h1>
        <p className="text-lg mb-6">
          Welcome to <span className="font-semibold">TableEase</span> — your smart and simple way to book a table online.
          We designed this platform to make restaurant reservations faster, smoother, and completely hassle-free.
        </p>

        <p className="text-lg mb-6">
          Whether you’re planning a romantic dinner, a family celebration, or a casual hangout, our system helps you find
          the perfect restaurant and reserve your spot instantly. No more waiting calls or confusion — just easy dining at your fingertips.
        </p>

        <p className="text-lg mb-6">
          Our mission is to help both customers and restaurants save time while improving the overall dining experience.
          Restaurants can manage their bookings effortlessly, and customers can enjoy guaranteed seating at their favorite places.
        </p>

        <p className="text-lg mb-6">
          Built with modern technology, our platform ensures real-time availability, smooth user experience, and secure booking confirmation.
          We’re constantly improving to make your dining experience better every day.
        </p>

        <p className="text-lg text-gray-600 italic">
          “Good food brings people together — we just make it easier to find your seat at the table.”
        </p>
      </section>
    </main>
  );
}
