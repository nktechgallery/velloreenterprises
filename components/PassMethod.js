'use client';

import { useEffect, useState } from 'react';
import { Section } from '@/components/ui';

const steps = [
  ['P', 'Pull the pin', 'Break the tamper seal while holding the extinguisher upright.'],
  ['A', 'Aim at the base', 'Target the fuel source instead of the visible flame tips.'],
  ['S', 'Squeeze slowly', 'Apply steady pressure to release the extinguishing agent.'],
  ['S', 'Sweep side to side', 'Cover the base until the fire is out, then watch for re-ignition.'],
];

export default function PassMethod() {
  const [active, setActive] = useState(0);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    const modelTimer = setTimeout(() => setShowModel(true), 1200);
    const stepTimer = setInterval(() => setActive((value) => (value + 1) % steps.length), 2600);
    return () => {
      clearTimeout(modelTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <Section
      id="pass-method"
      eyebrow="Training standard"
      title="The PASS method, made memorable"
      description="A simple operating model that helps teams respond clearly and safely when a portable extinguisher is appropriate."
      className="bg-[#070707]"
    >
      <div className="container-wide grid items-center gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <div className="glass-panel relative h-[340px] overflow-hidden p-5 md:h-[460px]">
          <div className="pass-visual">
            <div className="pass-ring pass-ring-a" />
            <div className="pass-ring pass-ring-b" />
            <div className="pass-card">
              <span className="font-condensed text-xs font-bold uppercase tracking-[0.24em] text-white/55">Portable extinguisher</span>
              <strong className="mt-3 block font-display text-4xl font-bold text-[#f5d76e]">PASS</strong>
              <p className="mt-3 text-sm leading-6 text-white/55">A clear sequence for first response when conditions are safe for portable extinguisher use.</p>
            </div>
          </div>
          {showModel && <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-white/55">Low-latency static training visual</div>}
        </div>
        <div className="grid gap-4">
          {steps.map(([letter, title, text], index) => (
            <button
              key={`${letter}-${title}`}
              type="button"
              onClick={() => setActive(index)}
              className={`grid gap-4 rounded-3xl border p-5 text-left transition md:grid-cols-[70px_1fr] md:p-6 ${
                active === index ? 'border-[#c9a227]/70 bg-[#c9a227]/10 shadow-[0_0_50px_rgba(201,162,39,.13)]' : 'border-white/10 bg-white/[0.035] hover:border-white/20'
              }`}
              aria-pressed={active === index}
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-black/35 font-display text-4xl font-black text-[#f5d76e]">{letter}</span>
              <span>
                <span className="block font-display text-2xl font-bold">{title}</span>
                <span className="mt-2 block text-sm leading-6 text-white/58">{text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
