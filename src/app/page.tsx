"use client";

import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: "🤖",
      title: "Coaching IA",
      description: "Programme intelligent qui s'adapte à vos progrès en temps réel avec notre algorithme breveté.",
      value: "95"
    },
    {
      icon: "📊",
      title: "Analyse 3D",
      description: "Tracking biométrique avec modélisation 3D de vos mouvements pour une correction parfaite.",
      value: "90"
    },
    {
      icon: "⚡",
      title: "Energy Scan",
      description: "Analyse votre fatigue et optimise vos séances pour des résultats maximaux.",
      value: "88"
    }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section - Améliorée avec animation */}
        <div className="video-section relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover brightness-[0.4]"
            >
              <source src="/assets/background.mp4" type="video/mp4" />
            </video>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              FITCOACH<span className="text-blue-400 animate-pulse">IA</span> POUR TOUS
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
              La performance adaptée à votre niveau grâce à l'intelligence artificielle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/calculator" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300"
              >
                Essayer gratuitement
              </Link>
              {!user && (
                <Link 
                  href="/register" 
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 duration-300"
                >
                  Voir démo
                </Link>
              )}
            </div>
          </div>
          
          {/* Animation scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white mt-2 rounded-full animate-scrollIndicator"></div>
            </div>
          </div>
        </div>

        {/* Features Section - Style plus premium */}
        <section className="py-20 px-4 max-w-7xl mx-auto" id="features">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-semibold tracking-widest">TECHNOLOGIE DE POINTE</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Nos <span className="text-blue-400">Innovations</span> Exclusives
            </h2>
            <div className="w-20 h-1 bg-blue-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-700 hover:border-blue-400 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${feature.value}%` }}
                  ></div>
                </div>
                <div className="text-right mt-2 text-blue-400 font-bold">
                  {feature.value}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* App Section - Design plus moderne */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white" id="app">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 relative">
                <div className="phone-mockup relative mx-auto w-72 h-[580px] bg-gray-800 rounded-[40px] p-3 shadow-2xl border-2 border-gray-700 transform rotate-1">
                  <div className="absolute -inset-2 rounded-[46px] bg-gradient-to-br from-blue-500 to-blue-700 opacity-20 blur-md"></div>
                  <div className="phone-screen absolute inset-1 bg-gray-900 rounded-[30px] overflow-hidden z-10">
                    <div className="app-interface h-full flex flex-col">
                      <div className="app-header flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-blue-400">FitCoachIA PRO</span>
                      </div>
                      <div className="app-metrics flex justify-around p-6">
                        <div className="metric text-center">
                          <span className="block text-3xl font-bold text-blue-400">87%</span>
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Performance</span>
                        </div>
                        <div className="metric text-center">
                          <span className="block text-3xl font-bold text-green-400">64%</span>
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Récupération</span>
                        </div>
                      </div>
                      <div className="wave-graph flex-1 bg-gradient-to-t from-gray-800 to-gray-900 m-4 rounded-lg flex items-end justify-between p-4">
                        {[20, 40, 60, 80, 60, 40, 60, 80, 100, 80, 60].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                            style={{ height: `${h}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -z-10"></div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <span className="text-blue-400 font-semibold tracking-widest">APPLICATION MOBILE</span>
                <h3 className="text-3xl md:text-4xl font-bold my-6">
                  Votre coach personnel <br />
                  <span className="text-blue-400">dans votre poche</span>
                </h3>
                <p className="text-lg text-gray-300 mb-8 max-w-lg">
                  Scannez pour installer FitCoachIA sur votre mobile et emportez votre coach partout avec vous
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="#" 
                    className="store-badge bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl inline-flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-2xl">🍏</span>
                    <div className="text-left">
                      <div className="text-xs">Télécharger sur</div>
                      <div className="text-lg font-bold">App Store</div>
                    </div>
                  </Link>
                  <Link 
                    href="#" 
                    className="store-badge bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl inline-flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-2xl">🤖</span>
                    <div className="text-left">
                      <div className="text-xs">Disponible sur</div>
                      <div className="text-lg font-bold">Google Play</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Design plus élégant */}
        <section className="py-24 px-4 max-w-7xl mx-auto" id="testimonials">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-semibold tracking-widest">SATISFACTION CLIENT</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Ils parlent de <span className="text-blue-400">nous</span>
            </h2>
            <div className="w-20 h-1 bg-blue-400 mx-auto"></div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 -z-10"></div>
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
                  <Image
                    src="/assets/user1.jpg"
                    alt="Jean D."
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg">
                  ❝
                </div>
              </div>
              <div className="text-center lg:text-left flex-1">
                <blockquote className="text-xl md:text-2xl italic mb-6 text-white leading-relaxed">
                  "L'IA a révolutionné mon entraînement. Adaptabilité et précision inégalées pour des résultats 2x plus rapides. Je recommande à 100% !"
                </blockquote>
                <div>
                  <div className="text-blue-400 font-bold text-lg">Jean D.</div>
                  <div className="text-gray-400">Athlète amateur - 3 mois d'utilisation</div>
                  <div className="flex justify-center lg:justify-start gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Plus impactante */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-blue-500 pattern-bg-transparent pattern-opacity-20 pattern-size-6"></div>
          </div>
          <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              PRÊT POUR LA <span className="text-blue-200">RÉVOLUTION</span> FITNESS?
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
              Votre corps mérite la technologie la plus avancée. Commencez votre transformation dès aujourd'hui.
            </p>
            <Link 
              href={user ? "/calculator" : "/register"} 
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-5 px-14 rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg duration-300"
            >
              {user ? "Faire un calcul" : "COMMENCER MAINTENANT"}
            </Link>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-10"></div>
        </section>

        {/* Footer - Design plus soigné */}
       
      </div>
    </MainLayout>
  );
}