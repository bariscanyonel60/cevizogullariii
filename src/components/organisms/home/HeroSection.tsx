"use client";

import Link from "next/link";
import { type PointerEvent, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { HOME_HERO_VIDEO } from "@/data/home-hero";

const trustItems = [
  "Stoklu yapı market",
  "Orman ürünleri & OSB",
  "Yapı - inşaat uygulamaları",
];

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_LAYOUT_CSS = `
.home-hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: #2a2d31;
}
.home-hero-video {
  position: relative;
  height: calc(32svh + 6.5rem);
  min-height: 16.5rem;
  overflow: hidden;
  cursor: crosshair;
  touch-action: pan-y;
}
.home-hero-video-el {
  position: absolute;
  top: 6.5rem;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 6.5rem);
  object-fit: cover;
  object-position: 58% center;
  transform-origin: center center;
  will-change: transform;
}
.home-hero-video-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(28, 30, 33, 0.42) 0%, transparent 22%),
    linear-gradient(180deg, transparent 58%, rgba(42, 45, 49, 0.88) 100%);
}
.home-hero-spot {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    420px circle at var(--mx, 72%) var(--my, 46%),
    rgba(226, 201, 138, 0.22),
    transparent 62%
  );
  mix-blend-mode: screen;
  transition: opacity 0.45s ease;
}
.home-hero-scan {
  position: absolute;
  top: 6.5rem;
  bottom: 0;
  left: 0;
  width: 1px;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    #c7a34a 16%,
    #e2c98a 50%,
    #c7a34a 84%,
    transparent 100%
  );
  box-shadow: 0 0 22px rgba(199, 163, 74, 0.55);
  transition: opacity 0.35s ease;
}
.home-hero-lens {
  position: absolute;
  top: 0;
  left: 0;
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;
  pointer-events: none;
  opacity: 0;
  border: 1px solid rgba(199, 163, 74, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 0 8px rgba(199, 163, 74, 0.08);
  transition: opacity 0.3s ease;
}
.home-hero-lens::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  margin: -2.5px 0 0 -2.5px;
  background: #c7a34a;
  border-radius: 50%;
}
.home-hero-frame {
  display: none;
  pointer-events: none;
}
.home-hero-stage.is-hot .home-hero-spot,
.home-hero-stage.is-hot .home-hero-scan,
.home-hero-stage.is-hot .home-hero-lens {
  opacity: 1;
}
.home-hero-stage.is-hot {
  cursor: none;
}
.home-hero-copy {
  position: relative;
  z-index: 2;
  margin-top: -4.75rem;
  padding: 4.75rem 1.25rem 2.15rem;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(42, 45, 49, 0.72) 18%,
    #2a2d31 38%,
    #2a2d31 100%
  );
}
.home-hero-copy-inner {
  pointer-events: auto;
  max-width: 36rem;
  color: rgba(255, 255, 255, 0.88);
}
.home-hero-copy-inner h1 {
  color: #fff;
}
.home-hero-copy-inner p,
.home-hero-copy-inner li {
  color: rgba(255, 255, 255, 0.88);
}
.home-hero-copy-inner .home-hero-kicker {
  color: #e2c98a;
}
.home-hero-copy-inner .home-hero-lead {
  color: rgba(255, 255, 255, 0.88);
}
@media (min-width: 640px) {
  .home-hero-video {
    height: calc(42svh + 6.5rem);
  }
  .home-hero-copy {
    padding: 5rem 1.5rem 2.5rem;
  }
}
@media (min-width: 1024px) {
  .home-hero-video {
    position: absolute;
    inset: 0;
    height: auto;
    min-height: 100%;
  }
  .home-hero-video-el {
    top: 0;
    height: 100%;
  }
  .home-hero-scan {
    top: 0;
  }
  .home-hero-video-shade {
    background:
      linear-gradient(90deg, rgba(28, 30, 33, 0.55) 0%, transparent 46%),
      linear-gradient(180deg, rgba(28, 30, 33, 0.38) 0%, transparent 18%),
      linear-gradient(180deg, transparent 78%, rgba(28, 30, 33, 0.28) 100%);
  }
  .home-hero-frame {
    display: block;
    position: absolute;
    top: 22%;
    right: 7.5rem;
    bottom: 11%;
    width: min(38vw, 34rem);
  }
  .home-hero-frame span {
    position: absolute;
    width: 22px;
    height: 22px;
    border-color: rgba(199, 163, 74, 0.7);
    border-style: solid;
  }
  .home-hero-frame span:nth-child(1) {
    top: 0;
    left: 0;
    border-width: 1px 0 0 1px;
  }
  .home-hero-frame span:nth-child(2) {
    top: 0;
    right: 0;
    border-width: 1px 1px 0 0;
  }
  .home-hero-frame span:nth-child(3) {
    right: 0;
    bottom: 0;
    border-width: 0 1px 1px 0;
  }
  .home-hero-frame span:nth-child(4) {
    bottom: 0;
    left: 0;
    border-width: 0 0 1px 1px;
  }
  .home-hero-copy {
    display: flex;
    align-items: center;
    width: min(46rem, 58vw);
    min-height: 100svh;
    margin-top: 0;
    padding: 7.75rem 2.5rem 4rem 4.25rem;
    background: linear-gradient(
      90deg,
      #1c1e21 0%,
      rgba(42, 45, 49, 0.94) 36%,
      rgba(42, 45, 49, 0.62) 64%,
      rgba(42, 45, 49, 0.18) 86%,
      transparent 100%
    );
  }
}
@media (hover: none) {
  .home-hero-video {
    cursor: grab;
  }
  .home-hero-lens {
    display: none;
  }
}
`;

type Point = { x: number; y: number };

export function HeroSection() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef(0);
  const hotRef = useRef(false);
  const pointerRef = useRef<Point>({ x: 0.72, y: 0.46 });
  const scanXRef = useRef(0.72);
  const shiftRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduce) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    let frame = 0;

    const tick = () => {
      const video = videoRef.current;
      const stage = stageRef.current;
      const scan = scanRef.current;
      const lens = lensRef.current;
      const pointer = pointerRef.current;
      const hot = hotRef.current;
      idleRef.current += 0.0032;

      scanXRef.current += (pointer.x - scanXRef.current) * 0.14;
      const scanX = scanXRef.current;

      if (video && video.duration > 0 && hot) {
        const next = video.currentTime + (scanX * video.duration - video.currentTime) * 0.16;
        if (Math.abs(next - video.currentTime) > 0.01) {
          video.currentTime = next;
        }
      }

      const targetX = hot ? (pointer.x - 0.5) * 28 : Math.sin(idleRef.current) * 10;
      const targetY = hot ? (pointer.y - 0.5) * 18 : Math.cos(idleRef.current * 0.7) * 8;
      const shift = shiftRef.current;
      shift.x += (targetX - shift.x) * 0.08;
      shift.y += (targetY - shift.y) * 0.08;
      const scale = hot ? 1.07 : 1.05 + Math.sin(idleRef.current * 0.45) * 0.008;
      if (video) {
        video.style.transform = `translate3d(${shift.x}px, ${shift.y}px, 0) scale(${scale})`;
      }

      if (stage) {
        stage.style.setProperty("--mx", `${pointer.x * 100}%`);
        stage.style.setProperty("--my", `${pointer.y * 100}%`);
      }
      if (scan) {
        scan.style.transform = `translate3d(${scanX * (stage?.clientWidth ?? 0)}px, 0, 0)`;
      }
      if (lens && stage) {
        lens.style.transform = `translate3d(${pointer.x * stage.clientWidth}px, ${pointer.y * stage.clientHeight}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  const setHot = (hot: boolean) => {
    hotRef.current = hot;
    stageRef.current?.classList.toggle("is-hot", hot);
    const video = videoRef.current;
    if (!video) return;
    if (hot) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  };

  const applyPointer = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    pointerRef.current = {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    applyPointer(event.clientX, event.clientY);
    setHot(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    applyPointer(event.clientX, event.clientY);
    if (event.pointerType === "mouse" || hotRef.current) {
      setHot(true);
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    if (event.pointerType !== "mouse") {
      setHot(false);
    }
  };

  const onPointerLeave = () => {
    if (reduce) return;
    setHot(false);
  };

  return (
    <section id="hero" className="home-hero">
      <style>{HERO_LAYOUT_CSS}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease }}
        className="home-hero-video"
      >
        <div
          ref={stageRef}
          className="home-hero-stage absolute inset-0"
          onPointerEnter={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerLeave}
          onPointerLeave={onPointerLeave}
        >
          <video
            ref={videoRef}
            className="home-hero-video-el pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HOME_HERO_VIDEO.poster}
            aria-label="Cevizoğulları Yapı İnşaat sahadan video. Fareyi kaydırarak sahayı gezinin."
          >
            <source src={HOME_HERO_VIDEO.src} type="video/mp4" />
          </video>
          <div className="home-hero-video-shade" />
          <div className="home-hero-spot" />
          <div ref={scanRef} className="home-hero-scan" />
          <div ref={lensRef} className="home-hero-lens" />
          <div className="home-hero-frame" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </motion.div>

      <div className="home-hero-copy">
        <div className="home-hero-copy-inner">
          <div className="border-l border-gold-400/70 pl-5 md:pl-7">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.08 }}
              className="home-hero-kicker mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.22em] sm:mb-4 sm:text-xs sm:tracking-[0.34em]"
            >
              Cevizoğulları · Turhal / Tokat
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease, delay: 0.18 }}
              className="font-display text-display font-bold tracking-tight text-balance text-white [text-shadow:0_12px_40px_rgba(0,0,0,0.35)]"
            >
              Tokat Yapı Malzemeleri
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.32 }}
              className="home-hero-lead mt-4 max-w-md text-lead sm:mt-5"
            >
              Turhal yapı malzemeleri reyonumuz: boya, mantolama, OSB, kereste.
              Listeyi getirin, yükleriz.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.44 }}
              className="mt-5 flex flex-wrap gap-2 sm:mt-6"
            >
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm"
                >
                  <CheckCircle2 className="size-3.5 text-gold-300" />
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.56 }}
              className="mt-6 flex flex-wrap gap-2.5"
            >
              <Button asChild size="md" variant="gold" className="lg:h-14 lg:px-8 lg:text-base">
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
              <Button asChild size="md" variant="outline" className="lg:h-14 lg:px-8 lg:text-base">
                <Link href="/yapi-malzemeleri">Ürünlere bak</Link>
              </Button>
            </motion.div>
          </div>
          <a
            href="#istatistik"
            className="mt-8 hidden text-white/40 transition hover:text-white/80 lg:inline-flex"
            aria-label="Aşağı kaydır"
          >
            <ChevronDown className="size-6 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
