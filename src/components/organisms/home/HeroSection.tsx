"use client";

import Link from "next/link";
import { type PointerEvent, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { HOME_HERO_VIDEO } from "@/data/home-hero";
import "./HeroSection.css";

const trustItems = [
  "Stoklu yapı market",
  "Orman ürünleri & OSB",
  "Yapı - inşaat uygulamaları",
];

const ease = [0.22, 1, 0.36, 1] as const;

type Point = { x: number; y: number };

function canScrubVideo() {
  return window.matchMedia("(min-width: 1024px) and (hover: hover)").matches;
}

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
      video.removeAttribute("src");
      video.pause();
      return;
    }
    if (!video.querySelector("source")) {
      const source = document.createElement("source");
      source.src = HOME_HERO_VIDEO.src;
      source.type = "video/mp4";
      video.appendChild(source);
    }
    video.load();
    void video.play().catch(() => undefined);
  }, [reduce]);

  useEffect(() => {
    if (reduce || !canScrubVideo()) return;
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
    if (reduce || !canScrubVideo()) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    applyPointer(event.clientX, event.clientY);
    setHot(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !canScrubVideo()) return;
    applyPointer(event.clientX, event.clientY);
    if (event.pointerType === "mouse" || hotRef.current) {
      setHot(true);
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !canScrubVideo()) return;
    if (event.pointerType !== "mouse") {
      setHot(false);
    }
  };

  const onPointerLeave = () => {
    if (reduce || !canScrubVideo()) return;
    setHot(false);
  };

  return (
    <section id="hero" className="home-hero">
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
            muted
            loop
            playsInline
            preload="none"
            poster={HOME_HERO_VIDEO.poster}
            aria-hidden="true"
          />
          <div className="home-hero-video-shade" />
          <div className="home-hero-vignette" />
          <div className="home-hero-grain" aria-hidden="true" />
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
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.08 }}
            className="home-hero-kicker mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.28em] sm:mb-5 sm:text-xs sm:tracking-[0.36em]"
          >
            Cevizoğulları · Turhal / Tokat
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.18 }}
            className="font-display text-display font-bold tracking-tight text-balance text-white [text-shadow:0_18px_50px_rgba(0,0,0,0.45)]"
          >
            <span className="home-hero-title-line">Tokat Yapı</span>
            <span className="home-hero-title-outline">Malzemeleri</span>
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
            className="home-hero-meta"
          >
            {trustItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.56 }}
            className="home-hero-actions"
          >
            <Button asChild size="md" variant="gold" className="lg:h-14 lg:px-8 lg:text-base">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <Button asChild size="md" variant="outline" className="lg:h-14 lg:px-8 lg:text-base">
              <Link href="/yapi-malzemeleri">Ürünlere bak</Link>
            </Button>
          </motion.div>
          <a
            href="#istatistik"
            className="mt-10 hidden text-white/35 transition hover:text-white/80 lg:inline-flex"
            aria-label="Aşağı kaydır"
          >
            <ChevronDown className="size-6 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
