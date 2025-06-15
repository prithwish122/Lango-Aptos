'use client'
import Link from 'next/link';
import React from 'react';
import LoginButton from '@/app/components/LoginButton';
import { WalletSelector } from './components/WalletSelector';
// import { useOCAuth } from '@opencampus/ocid-connect-js';

const LandingPage = () => {
  // const { authState, ocAuth } = useOCAuth();

  // Ensure authState is defined before accessing its properties
 

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f4f1] via-[#e8e6f4] to-[#f8e6e6]"></div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-6">
            <div className="bg-white/30 backdrop-blur-sm rounded-full px-8 py-2 shadow-sm hover:bg-white/40 transition-colors duration-300">
              <div className="flex space-x-12 items-center">
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300">
                  Start Learning
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300">
                  Features
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300">
                  Get Tokens
                </a>
                <WalletSelector/>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 mt-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-7xl md:text-8xl font-thin tracking-wide text-gray-900 mb-2 animate-fade-in-up">
            LangEdu
          </h1>
          <h2 className="text-5xl md:text-6xl font-serif italic text-gray-600 mb-8 animate-fade-in-up-delay">
            Learning
          </h2>
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-12 animate-fade-in-up-delay-2">
            Master Languages While Earning Rewards
          </p>

          {/* Get Started Button */}
          <div className="animate-fade-in-up-delay-3">
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:scale-105 hover:shadow-xl">
              <span className="relative">Get Started Now</span>
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 group-hover:opacity-0 transition-opacity duration-300 blur-lg"></span>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Active Learners' },
              { number: '25+', label: 'Languages' },
              { number: '1M+', label: 'Tokens Earned' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300 hover:text-purple-600">
                <div className="text-4xl font-light text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What and Why Section */}
        <div className="mt-32 max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">What & Why</h2>
            <p className="text-gray-500">Discover how LangEdu is revolutionizing language learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:bg-white/50 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-light text-gray-800 mb-4">What is LangEdu?</h3>
              <p className="text-gray-600 leading-relaxed">
                LangEdu is an innovative language learning platform that combines traditional learning methods with blockchain technology. Our unique approach allows learners to earn tokens while mastering new languages, creating a rewarding educational experience that keeps you motivated and engaged.
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:bg-white/50 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-light text-gray-800 mb-4">Why Choose Us?</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe learning should be both effective and rewarding. Our platform offers personalized learning paths, native speaker interactions, and a token-based reward system that recognizes your progress. With LangEdu, you're not just learning a language – you're investing in your future.
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-32 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Daily Lessons', description: 'Learn at your own pace and earn tokens' },
              { title: 'Native Speakers', description: 'Practice with language experts' },
              { title: 'Token Rewards', description: 'Convert learning into real value' }
            ].map((feature, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-light text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Press']
              },
              {
                title: 'Resources',
                links: ['Blog', 'Guide', 'Help Center']
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Cookie Policy']
              },
              {
                title: 'Connect',
                links: ['Twitter', 'Discord', 'Telegram']
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-800 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              © 2024 LangEdu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 z-0">
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-slow-spin">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-100/40 to-transparent rounded-full mix-blend-normal filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-rose-100/40 to-transparent rounded-full mix-blend-normal filter blur-3xl"></div>
        </div>
      </div>

      {/* Add required styles to head */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slow-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;