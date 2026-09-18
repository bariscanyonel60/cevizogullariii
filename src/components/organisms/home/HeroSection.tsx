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
  const stageSizeRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduce) {
      video.removeAttribute("src");
      video.pause();
      return;
    }

    let cancelled = false;
    const attach = () => {
      if (cancelled || !videoRef.current) return;
      const el = videoRef.current;
      if (!el.querySelector("source")) {
        const source = document.createElement("source");
        source.src = HOME_HERO_VIDEO.src;
        source.type = "video/mp4";
        el.appendChild(source);
      }
      el.load();
      void el.play().catch(() => undefined);
    };

    // LCP sonrası: poster kalsın, ağır mp4 kritik yolu tıkamasın
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(attach, { timeout: 2200 });
    } else {
      timeoutId = window.setTimeout(attach, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [reduce]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      stageSizeRef.current = {
        x: stage.clientWidth,
        y: stage.clientHeight,
      };
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

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
      const size = stageSizeRef.current;
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
      if (scan && size.x > 0) {
        scan.style.transform = `translate3d(${scanX * size.x}px, 0, 0)`;
      }
      if (lens && size.x > 0 && size.y > 0) {
        lens.style.transform = `translate3d(${pointer.x * size.x}px, ${pointer.y * size.y}px, 0)`;
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
    const size = stageSizeRef.current;
    if (size.x < 1 || size.y < 1) return;
    const rect = stage.getBoundingClientRect();
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
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
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
          <p className="home-hero-kicker mb-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.24em] sm:mb-5 sm:text-xs sm:tracking-[0.36em]">
            Cevizoğulları · Turhal / Tokat
          </p>
          {/* LCP: opacity animasyonu yok — metin ilk boyamada görünür */}
          <h1 className="font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-balance text-white [text-shadow:0_18px_50px_rgba(0,0,0,0.45)] sm:text-display sm:leading-none">
            <span className="home-hero-title-line">Tokat Yapı</span>
            <span className="home-hero-title-outline">Malzemeleri</span>
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.12 }}
            className="home-hero-lead mt-2.5 max-w-md text-[0.95rem] leading-snug sm:mt-5 sm:text-lead sm:leading-normal"
          >
            Turhal yapı malzemeleri reyonumuz: boya, mantolama, OSB, kereste.
            Listeyi getirin, yükleriz.
          </motion.p>
          <motion.ul
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
            className="home-hero-meta"
          >
            {trustItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.28 }}
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
