import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#EFECE6] border-b border-[#EAE5DE]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="text-[10px] tracking-[0.34em] uppercase text-[#7C746B] font-medium block mb-3">
          PRIVATE ATELIER INVITATION
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-[#1D1D1B] mb-4">
          Stay in the LORÉA World
        </h2>

        <p className="text-sm sm:text-base text-[#7C746B] font-light max-w-md mx-auto leading-relaxed mb-8">
          Subscribers receive early access to seasonal collection drops, private salon invitations in Cairo, and fabric sourcing stories.
        </p>

        {isSubmitted ? (
          <div className="bg-[#F7F4EF] p-6 max-w-md mx-auto border border-[#B7ADA2]/40 text-center animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[#1D1D1B] text-[#F7F4EF] flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 stroke-[2]" />
            </div>
            <p className="font-serif text-lg text-[#1D1D1B] mb-1">Welcome to LORÉA</p>
            <p className="text-xs text-[#7C746B] font-light">
              Your invitation has been sent to {email}. Use code <strong className="font-medium text-[#1D1D1B]">LOREA10</strong> for 10% off your first atelier order.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3.5 bg-[#F7F4EF] border border-[#D4CCC2] text-sm text-[#1D1D1B] placeholder-[#A0988E] focus:outline-hidden focus:border-[#1D1D1B] transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#2A2928] text-xs tracking-[0.24em] uppercase font-medium transition-all"
            >
              JOIN
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#A0988E] font-light mt-4">
          By joining, you agree to our Privacy Policy. You can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
