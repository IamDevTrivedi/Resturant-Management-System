'use client';

import React from 'react';

export default function Contact() {
  const members = [
    { name: 'Dev Trivedi', role: 'Team Leader' },
    { name: 'Heet Bhuva', role: 'Frontend Developer' },
    { name: 'Jenish Macwan', role: 'Frontend Developer' },
    { name: 'Anushka Rawat', role: 'Frontend Developer' },
    { name: 'Dhara Jogadiya', role: 'Frontend Developer' },
    { name: 'Hardik Rathva', role: 'Frontend Developer' },
    { name: 'Rudra Chauhan', role: 'Frontend Developer' },
    { name: 'Nihar Nadia', role: 'Backend Developer' },
    { name: 'Krish Dhola', role: 'Backend Developer' },
    { name: 'Shrey Shah', role: 'Backend Developer' },
  ];

  // Group members by role for better structure
  const leader = members.filter((m) => m.role === 'Team Leader');
  const frontend = members.filter((m) => m.role === 'Frontend Developer');
  const backend = members.filter((m) => m.role === 'Backend Developer');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
      <section className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#f4b968]">Our Team</h1>
        <p className="text-lg ">
          Meet the passionate and dedicated team behind the{' '}
          <span className="font-semibold">Restaurant Reservation System</span> project.
        </p>
      </section>

      {/* Team Leader */}
      <section className="max-w-5xl w-full mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Team Leader</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {leader.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl w-60 hover:shadow-lg transition border-1 border-[#f4b968]"
            >
              <h3 className="text-xl font-semibold text-white">{m.name}</h3>
              <p className="text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frontend Developers */}
      <section className="max-w-5xl w-full mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-4 ">Frontend Developers</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {frontend.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl w-60 hover:shadow-lg transition border-1 border-[#f4b968]"
            >
              <h3 className="text-xl font-semibold text-white">{m.name}</h3>
              <p className="text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Backend Developers */}
      <section className="max-w-5xl w-full mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-4 ">Backend Developers</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {backend.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl w-60 hover:shadow-lg transition border-1 border-[#f4b968]"
            >
              <h3 className="text-xl font-semibold text-white">{m.name}</h3>
              <p className="text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
