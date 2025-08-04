'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:9090/api/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      
      // Save token
      localStorage.setItem('token', data.token);
      
      // Show success message
      setMessage({ 
        type: 'success', 
        text: 'Login successful! Redirecting to dashboard...' 
      });

      // Redirect after brief delay to show success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
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
        
        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-md text-sm relative ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-start">
              <span className="mr-2">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="flex-1">{message.text}</span>
              <button
                onClick={clearMessage}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500 placeholder-gray-500"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4EB665] pr-10 text-gray-500 placeholder-gray-500"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use at least 8 characters with 1 number, and one special character.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-full transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4EB665] hover:bg-green-700'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'LOG IN'
            )}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-gray-400 underline cursor-pointer hover:text-gray-600">
          Forgot password?
        </p>
      </div>
    </div>
  );
}