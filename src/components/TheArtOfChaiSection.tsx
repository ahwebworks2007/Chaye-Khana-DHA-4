import React, { useEffect, useRef, useState } from 'react';

export const TheArtOfChaiSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollParallax, setScrollParallax] = useState(0);

  // Intersection Observer for scroll reveal and animation lifecycle
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: [0.15, 0.45],
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Subtle Parallax calculation (Desktop only)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleScroll = () => {
      if (window.innerWidth < 1024 || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const relativeProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const subtleOffset = (relativeProgress - 0.5) * 20; // Max 10px vertical drift
        setScrollParallax(subtleOffset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Atmospheric Steam & Subtle Pour Simulation Canvas
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 600);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 750);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 600;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 750;
    };

    window.addEventListener('resize', handleResize);

    // Steam particles system
    interface SteamParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      maxOpacity: number;
      growth: number;
      life: number;
      maxLife: number;
      driftPhase: number;
    }

    const steamParticles: SteamParticle[] = [];
    const maxParticles = 24;

    const createParticle = (originX: number, originY: number): SteamParticle => {
      const maxLife = 120 + Math.random() * 80;
      return {
        x: originX + (Math.random() - 0.5) * 35 * window.devicePixelRatio,
        y: originY + (Math.random() - 0.5) * 15 * window.devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.3 * window.devicePixelRatio,
        vy: -(0.55 + Math.random() * 0.45) * window.devicePixelRatio,
        radius: (14 + Math.random() * 12) * window.devicePixelRatio,
        opacity: 0,
        maxOpacity: 0.08 + Math.random() * 0.07, // Extremely subtle, non-intrusive
        growth: (0.18 + Math.random() * 0.15) * window.devicePixelRatio,
        life: 0,
        maxLife,
        driftPhase: Math.random() * Math.PI * 2,
      };
    };

    // Pour cycle state
    let cycleTime = 0;
    let ripples: { radius: number; opacity: number }[] = [];

    const render = () => {
      if (!isVisible) {
        // Pause animation when off-screen to conserve GPU
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Cup origin coordinates (relative to bottom-center of visual)
      const cupX = width * 0.52;
      const cupY = height * 0.68;
      const spoutX = width * 0.58;
      const spoutY = height * 0.15;

      cycleTime += 0.012; // Complete pour cycle ~ 4.5s
      const cyclePhase = (Math.sin(cycleTime) + 1) / 2; // 0 to 1
      const isPouring = cyclePhase > 0.25 && cyclePhase < 0.85;

      // 1. Draw Subtle Amber Tea Stream during Pour
      if (isPouring) {
        const streamIntensity = Math.sin(((cyclePhase - 0.25) / 0.6) * Math.PI);
        const streamWidth = (2.2 + streamIntensity * 1.6) * window.devicePixelRatio;

        // Fluid bezier curve with natural gravity bend
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(spoutX, spoutY);
        ctx.quadraticCurveTo(
          spoutX - 8 * window.devicePixelRatio,
          (spoutY + cupY) * 0.5,
          cupX,
          cupY
        );

        // Warm Karak Chai Amber Gradient
        const streamGradient = ctx.createLinearGradient(spoutX, spoutY, cupX, cupY);
        streamGradient.addColorStop(0, `rgba(224, 155, 94, ${0.45 * streamIntensity})`);
        streamGradient.addColorStop(0.5, `rgba(202, 130, 72, ${0.75 * streamIntensity})`);
        streamGradient.addColorStop(1, `rgba(235, 175, 120, ${0.85 * streamIntensity})`);

        ctx.strokeStyle = streamGradient;
        ctx.lineWidth = streamWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Soft outer glow of liquid stream
        ctx.beginPath();
        ctx.moveTo(spoutX, spoutY);
        ctx.quadraticCurveTo(
          spoutX - 8 * window.devicePixelRatio,
          (spoutY + cupY) * 0.5,
          cupX,
          cupY
        );
        ctx.strokeStyle = `rgba(240, 185, 130, ${0.18 * streamIntensity})`;
        ctx.lineWidth = streamWidth * 2.8;
        ctx.stroke();
        ctx.restore();

        // Trigger surface ripple periodically
        if (Math.random() < 0.08) {
          ripples.push({ radius: 2 * window.devicePixelRatio, opacity: 0.45 });
        }
      }

      // 2. Animate and Render Surface Ripples in Cup
      ripples.forEach((ripple, index) => {
        ripple.radius += 0.45 * window.devicePixelRatio;
        ripple.opacity -= 0.008;

        if (ripple.opacity > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(
            cupX,
            cupY,
            ripple.radius * 1.8,
            ripple.radius * 0.6,
            0,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(255, 220, 180, ${ripple.opacity * 0.5})`;
          ctx.lineWidth = 1 * window.devicePixelRatio;
          ctx.stroke();
          ctx.restore();
        }
      });
      ripples = ripples.filter((r) => r.opacity > 0);

      // 3. Realistic Rising Steam Particles
      if (steamParticles.length < maxParticles && Math.random() < 0.25) {
        steamParticles.push(createParticle(cupX, cupY - 10 * window.devicePixelRatio));
      }

      steamParticles.forEach((p, index) => {
        p.life++;
        p.driftPhase += 0.02;
        p.x += p.vx + Math.sin(p.driftPhase) * 0.25 * window.devicePixelRatio;
        p.y += p.vy;
        p.radius += p.growth;

        // Smooth fade-in, long linger, smooth fade-out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.25) {
          p.opacity = (lifeRatio / 0.25) * p.maxOpacity;
        } else {
          p.opacity = (1 - (lifeRatio - 0.25) / 0.75) * p.maxOpacity;
        }

        if (p.opacity > 0.001) {
          ctx.save();
          const radialGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          radialGrad.addColorStop(0, `rgba(255, 248, 240, ${p.opacity})`);
          radialGrad.addColorStop(0.45, `rgba(250, 235, 220, ${p.opacity * 0.6})`);
          radialGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = radialGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Remove expired steam particles
      for (let i = steamParticles.length - 1; i >= 0; i--) {
        if (steamParticles[i].life >= steamParticles[i].maxLife) {
          steamParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="art-of-chai-section"
      className="relative w-full bg-[#030304] text-white py-24 sm:py-28 lg:py-32 border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT: CINEMATIC CHAI VISUAL (58% on Desktop, First on Mobile) */}
          {/* ========================================================================= */}
          <div
            className={`lg:col-span-7 relative w-full h-[480px] sm:h-[560px] lg:h-[680px] xl:h-[720px] rounded-[2px] overflow-hidden bg-[#070709] border border-white/[0.06] shadow-2xl transition-all duration-[1000ms] ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.985]'
            }`}
          >
            {/* Cinematic High-Res Food Photography Asset */}
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=88"
              alt="The Art of Chai at Chaayé Khana — authentic slow brewing and pouring into fine ceramic tea cup"
              className="w-full h-full object-cover object-[center_60%] transition-transform duration-[1200ms] ease-out hover:scale-[1.025] motion-reduce:transform-none"
              style={{
                transform: scrollParallax ? `translate3d(0, ${scrollParallax}px, 0)` : undefined,
              }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Depth of Field and Atmospheric Vignette Gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

            {/* High-Fidelity Canvas for Ambient Steam & Gentle Pour Simulation */}
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 w-full h-full"
            />

            {/* Subtle Authentic Corner Tag */}
            <div className="absolute bottom-5 left-5 z-20 pointer-events-none flex items-center space-x-2 text-[10px] tracking-[0.2em] text-white/70 uppercase font-light bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[2px] border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              <span>Slow Steeped • Hand Poured</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: EDITORIAL STORY CONTENT (42% on Desktop) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pl-4 xl:pl-8">
            {/* Eyebrow */}
            <div
              className={`transition-all duration-[800ms] ease-out delay-150 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.24em] uppercase text-neutral-400 block mb-4 sm:mb-5">
                THE ART OF CHAI
              </span>
            </div>

            {/* Main Heading */}
            <h2
              className={`font-serif font-normal text-white text-[36px] sm:text-[44px] md:text-[50px] lg:text-[54px] leading-[1.08] tracking-[-0.01em] transition-all duration-[850ms] ease-out delay-250 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Brewed with patience.
              <br />
              Served with warmth.
            </h2>

            {/* Story Text */}
            <p
              className={`mt-7 text-[16px] sm:text-[17px] leading-[1.75] text-[#AFAFAF] max-w-[500px] font-light transition-all duration-[900ms] ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Tea has always been more than a drink at Chaayé Khana. It is a moment to pause,
              gather and connect.
            </p>

            {/* Secondary Story */}
            <p
              className={`mt-[22px] text-[14.5px] sm:text-[15px] leading-[1.7] text-[#8F8F8F] max-w-[480px] font-light transition-all duration-[900ms] ease-out delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              From the first pour to the final sip, every cup is prepared to be savoured.
            </p>

            {/* Optional Micro-Detail Accent Line */}
            <div
              className={`mt-9 pt-8 border-t border-white/[0.06] flex items-center space-x-3 transition-all duration-[1000ms] ease-out delay-[600ms] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#777777] font-medium">
                THE RITUAL OF CHAAYÉ KHANA
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
