import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface HeroProps {
  onSearchClick: () => void;
}

// Bubble Logo Component
const BubbleLogo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.2"/>
      <circle cx="24" cy="24" r="16" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="24" r="12" fill="currentColor" opacity="0.6"/>
      <circle cx="24" cy="24" r="8" fill="currentColor"/>
      <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.8"/>
      <circle cx="30" cy="16" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="32" cy="28" r="2.5" fill="currentColor" opacity="0.7"/>
    </svg>
  </div>
);

const Hero: React.FC<HeroProps> = ({ onSearchClick }) => {
  return (
    <div className="relative pt-16 pb-8 md:pb-12 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent-500 rounded-full opacity-10 animate-bounce-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent-400 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-accent-300 rounded-full opacity-15 animate-bounce"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-6">
            <BubbleLogo size={48} className="text-accent-500 mr-4 animate-pulse" />
            <span className="text-accent-500 font-bold text-lg tracking-wide">VAMOS JOGAR?</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Descubra e participe dos
            <span className="block bg-gradient-to-r from-accent-500 to-accent-300 bg-clip-text text-transparent">
              torneios mais emocionantes
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed">
            Participe de competições perto de você, acompanhe seus resultados e viva a evolução no esporte
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={onSearchClick}
              className="group bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center">
                Explorar Torneios
                <ArrowUpRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="bg-transparent border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-dark-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Cadastro
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center md:justify-start space-x-8 text-gray-300">
            <div className="text-center">
              <div className="text-2xl font-black text-accent-500">500+</div>
              <div className="text-sm">Torneios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-accent-500">10k+</div>
              <div className="text-sm">Atletas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-accent-500">150+</div>
              <div className="text-sm">Clubes</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern geometric shape */}
      <div className="absolute -bottom-20 right-0 left-0 h-24 bg-light transform skew-y-1 z-0" />
    </div>
  );
};

export { BubbleLogo };
export default Hero;