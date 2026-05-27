'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const passSteps = [
  {
    letter: 'P',
    title: 'Pull the Pin',
    subtitle: 'Break the safety seal',
    description: 'Pull the safety pin located at the top of the extinguisher. This breaks the tamper seal and allows the handle to be pressed. Hold the extinguisher upright with the nozzle pointing away from you.',
    detail: 'The pin prevents accidental discharge. Always ensure you\'re standing 6-8 feet away from the fire before proceeding.',
    icon: '🔑',
    color: '#C9A227',
    bgAccent: 'rgba(201,162,39,0.08)',
  },
  {
    letter: 'A',
    title: 'Aim at the Base',
    subtitle: 'Target the fire\'s source',
    description: 'Aim the nozzle or hose at the BASE of the fire, not at the flames. Targeting the source of the fuel is critical for effective extinguishment.',
    detail: 'Aiming at flames instead of the base is the most common mistake. The agent must reach the fuel source to work effectively.',
    icon: '🎯',
    color: '#FF6600',
    bgAccent: 'rgba(255,102,0,0.08)',
  },
  {
    letter: 'S',
    title: 'Squeeze the Handle',
    subtitle: 'Activate the extinguisher',
    description: 'Squeeze the handle or lever slowly and evenly. This releases the extinguishing agent. Releasing the handle will stop the discharge.',
    detail: 'Most extinguishers discharge their entire contents in 10-25 seconds. Use this time wisely and systematically.',
    icon: '✊',
    color: '#CC2200',
    bgAccent: 'rgba(204,34,0,0.08)',
  },
  {
    letter: 'S',
    title: 'Sweep Side to Side',
    subtitle: 'Cover the fire completely',
    description: 'Sweep the nozzle from side to side at the base of the fire until it appears to be out. Move closer as the fire diminishes. Watch for re-ignition.',
    detail: 'Continue sweeping until the fire is completely out. Back away while watching carefully for re-ignition or hidden embers.',
    icon: '↔️',
    color: '#C9A227',
    bgAccent: 'rgba(201,162,39,0.08)',
  },
];

function StepCard({ step, index, isActive }) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: false });

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`relative p-8 lg:p-10 border transition-all duration-500 ${
          isActive
            ? 'border-[rgba(201,162,39,0.5)] bg-[rgba(201,162,39,0.04)]'
            : 'border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]'
        }`}
      >
        {/* Step number + letter */}
        <div className="flex items-start gap-6 mb-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 flex items-center justify-center border-2 text-5xl font-black"
              style={{
                borderColor: step.color,
                color: step.color,
                fontFamily: "'Playfair Display', serif",
                boxShadow: `0 0 30px ${step.color}30`,
                backgroundColor: step.bgAccent,
              }}
            >
              {step.letter}
            </div>
            <div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ backgroundColor: step.color }}
            >
              {index + 1}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: step.color, fontFamily: "'Barlow Condensed', sans-serif" }}>
              Step {index + 1}
            </p>
            <h3 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {step.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{step.subtitle}</p>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed mb-4">{step.description}</p>

        <div
          className="flex items-start gap-3 p-4 border-l-2 text-sm text-gray-400"
          style={{ borderColor: step.color, backgroundColor: step.bgAccent }}
        >
          <span className="text-lg flex-shrink-0" aria-hidden="true">{step.icon}</span>
          <p>{step.detail}</p>
        </div>

        {/* Connector line */}
        {index < 3 && (
          <div className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.2)] to-transparent" />
        )}
      </div>
    </div>
  );
}

export default function PassMethod() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pass-method"
      className="pass-section py-24 lg:py-36 relative overflow-hidden"
      aria-label="PASS Method Fire Safety Guide"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(201,162,39,0.04)_0%,transparent_70%)]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(204,34,0,0.04)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.2)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.2)] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Essential Fire Safety Knowledge
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The{' '}
            <span className="text-gold-gradient">PASS</span>{' '}
            Method
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            The four-step technique used by professionals worldwide to safely and effectively operate a fire extinguisher. Learn it. Remember it. It could save a life.
          </p>

          {/* PASS letter indicators */}
          <div className="flex justify-center gap-4 mt-8" role="tablist" aria-label="PASS method steps">
            {passSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                role="tab"
                aria-selected={activeStep === idx}
                aria-label={`Step ${idx + 1}: ${step.title}`}
                className={`w-12 h-12 text-xl font-black border-2 transition-all duration-300 ${
                  activeStep === idx
                    ? 'border-[#C9A227] text-[#C9A227] bg-[rgba(201,162,39,0.1)] scale-110'
                    : 'border-[rgba(255,255,255,0.1)] text-gray-500 hover:border-[rgba(201,162,39,0.3)]'
                }`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {step.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 lg:gap-0" role="tabpanel">
          {passSteps.map((step, index) => (
            <StepCard
              key={index}
              step={step}
              index={index}
              isActive={activeStep === index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.03)]">
            <div className="text-left">
              <p className="text-white font-semibold">Need fire safety training for your team?</p>
              <p className="text-gray-400 text-sm">We provide hands-on fire safety training and AMC services.</p>
            </div>
            <a
              href="/amc"
              className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold text-sm tracking-wider hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer whitespace-nowrap"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
            >
              GET AMC SERVICE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
