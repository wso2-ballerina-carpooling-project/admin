'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- important

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const router = useRouter(); // <-- initialize router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy validation (you can replace this with real logic)
    if (email === 'admin@carpool.com' && password === 'Admin@123') {
      router.push('/dashboard'); // <-- navigate to dashboard
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0E2A] px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-[#FF7300]">C</span>ar<span className="text-[#FF7300]">P</span>ool
        </h1>
        <p className="text-sm text-gray-500">Ride Sharing Service</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-lg px-10 py-10">
        <h2 className="text-lg font-semibold text-center mb-6 text-black">Welcome back!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email address</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4EB665] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                👁️
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use at least 8 characters with 1 number, and one special character.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-[#4EB665] text-white font-semibold py-2 rounded-full hover:bg-green-700"
          >
            LOG IN
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-400 underline cursor-pointer">
          Forgot password?
        </p>
      </div>
    </div>
  );
}


