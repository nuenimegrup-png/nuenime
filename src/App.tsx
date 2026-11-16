/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Download,
  Mail,
  Smartphone,
  Monitor,
  Terminal,
  Laptop,
  ShieldCheck,
  ArrowUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ApkArch,
  AppPlatform,
  PLATFORM_LIST,
  FALLBACK_RELEASES,
  GITHUB_API_RELEASES_URL,
  GitHubRelease,
  detectPreferredArch,
  formatBytesToMB,
  normalizeVersionTag,
  selectApkAsset,
  selectPlatformAsset,
} from './utils/githubRelease';

const LOGO_SRC = '/assets/images/nuenime-logo.png';
const LOGO_FALLBACK_SRC = '/assets/images/nue-ai-v2.png';

export default function App() {
  const [pageLoaded, setPageLoaded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return true;
    }
    return false;
  });
  const [navScrolled, setNavScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [releases, setReleases] = useState<GitHubRelease[]>(FALLBACK_RELEASES);
  const [selectedPlatform, setSelectedPlatform] = useState<AppPlatform>('android');
  const [selectedArch, setSelectedArch] = useState<ApkArch>(() =>
    typeof navigator !== 'undefined' ? detectPreferredArch(navigator.userAgent) : 'universal'
  );

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const heroRef = useRef<HTMLElement | null>(null);
  const phoneTiltRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  const latestRelease = releases[0] || FALLBACK_RELEASES[0];
  const versionInfo = normalizeVersionTag(latestRelease.tag_name);

  const androidAsset = selectApkAsset(latestRelease, selectedArch);
  const activePlatformAsset = selectPlatformAsset(latestRelease, selectedPlatform, selectedArch);
  const currentPlatformInfo =
    PLATFORM_LIST.find((p) => p.id === selectedPlatform) || PLATFORM_LIST[0];

  const universalAsset = selectApkAsset(latestRelease, 'universal');
  const arm64Asset = selectApkAsset(latestRelease, 'arm64');
  const arm32Asset = selectApkAsset(latestRelease, 'arm32');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 4200);
  }, []);

  const triggerApkDownload = useCallback(
    (assetUrl: string, assetName: string, tag: string) => {
      const verBadge = normalizeVersionTag(tag).badge;
      showToast(
        `Mengunduh ${assetName} (${verBadge}) — buka file setelah terunduh untuk langsung menginstal.`
      );

      const a = document.createElement('a');
      a.href = assetUrl;
      a.setAttribute('download', assetName);
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    [showToast]
  );

  // Preloader effect
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPageLoaded(true);
    }, 550);
    return () => window.clearTimeout(timer);
  }, []);

  // Fetch latest release metadata on mount so download links and version stay current
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${GITHUB_API_RELEASES_URL}?per_page=10`, {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        });
        if (!res.ok) return;
        const data: GitHubRelease[] = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setReleases(data);
        }
      } catch {
        // Silently keep fallback release data
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Top nav scroll state
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Center animation slide rotation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [currentSlide]);

  // IntersectionObserver for .reveal elements
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('on'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('on');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // 3D Tilt & Spotlight effect on fine pointer devices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer:fine)').matches) {
      return;
    }
    const hero = heroRef.current;
    const stage = phoneTiltRef.current;
    const spot = spotlightRef.current;
    if (!hero || !stage || !spot) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let mx = -700;
    let my = -700;
    let sx = -700;
    let sy = -700;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      mx = e.clientX;
      my = e.clientY;
    };

    const onPointerLeave = () => {
      tx = 0;
      ty = 0;
      mx = -700;
      my = -700;
    };

    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      sx += (mx - sx) * 0.12;
      sy += (my - sy) * 0.12;
      stage.style.transform = `rotateY(${cx * 9}deg) rotateX(${-cy * 7}deg)`;
      spot.style.transform = `translate(${sx - 320}px, ${sy - 320}px)`;
      rafId = window.requestAnimationFrame(loop);
    };

    hero.addEventListener('pointermove', onPointerMove);
    hero.addEventListener('pointerleave', onPointerLeave);
    rafId = window.requestAnimationFrame(loop);

    return () => {
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMagneticMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${x * 7}px, ${y * 6}px)`;
  };

  const handleMagneticLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  const handleSelectPlatform = (platformId: AppPlatform) => {
    setSelectedPlatform(platformId);
  };

  const handleDownloadClick = () => {
    if (!activePlatformAsset?.browser_download_url) {
      return;
    }
    triggerApkDownload(
      activePlatformAsset.browser_download_url,
      activePlatformAsset.name,
      latestRelease.tag_name
    );
  };

  const handleAndroidSlideDownloadClick = () => {
    if (!androidAsset?.browser_download_url) {
      showToast('Tautan unduhan APK akan aktif saat rilis resmi — pantau terus halaman ini.');
      return;
    }
    triggerApkDownload(
      androidAsset.browser_download_url,
      androidAsset.name,
      latestRelease.tag_name
    );
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== LOGO_FALLBACK_SRC) {
      img.src = LOGO_FALLBACK_SRC;
    }
  };

  const renderPlatformIcon = (platformId: AppPlatform) => {
    switch (platformId) {
      case 'android':
        return <Smartphone />;
      case 'windows':
        return <Monitor />;
      case 'linux':
        return <Terminal />;
      case 'macos':
        return <Laptop />;
    }
  };

  const slideNames = ['UNDUH', 'ANDROID'];

  return (
    <div className={pageLoaded ? 'page-loaded' : ''}>
      {/* Preloader */}
      <div id="preloader" className={pageLoaded ? 'loaded' : ''} aria-hidden={pageLoaded}>
        <div className="pre-inner">
          <img
            className="pre-logo-img"
            src={LOGO_SRC}
            onError={handleImgError}
            alt="Nuenime"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Grain film */}
      <div className="grain" aria-hidden="true"></div>

      {/* Navigasi */}
      <nav className={`top ${navScrolled ? 'scrolled' : ''}`} id="topNav">
        <a className="logo" href="#hero" aria-label="Nuenime">
          <img
            src={LOGO_SRC}
            onError={handleImgError}
            alt="Nuenime"
            referrerPolicy="no-referrer"
          />
        </a>
        <div className="nav-links">
          <a href="#download">Unduh</a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kontak
          </a>
        </div>
        <a className="btn btn-outline btn-sm" href="#download">
          <Download />
          Download
        </a>
      </nav>

      <main>
        {/* ============ HERO ============ */}
        <section className="hero" id="hero" ref={heroRef}>
          <div id="spotlight" ref={spotlightRef} aria-hidden="true"></div>
          <div className="hero-grid" aria-hidden="true"></div>
          <span className="plus" style={{ top: '16%', left: '5%' }} aria-hidden="true">
            +
          </span>
          <span className="plus" style={{ bottom: '24%', right: '7%' }} aria-hidden="true">
            +
          </span>
          <span className="plus" style={{ top: '58%', left: '46%' }} aria-hidden="true">
            +
          </span>

          <div className="wrap hero-inner">
            <div>
              <h1 className="h-anim" style={{ ['--d' as string]: '.1s' }}>
                Nonton anime,
                <br />
                <span className="chrome">tanpa kompromi.</span>
              </h1>
              <p className="hero-sub h-anim" style={{ ['--d' as string]: '.24s' }}>
                <strong>Nuenime</strong> — aplikasi streaming anime yang bersih, cepat, dan
                mobile-first. Dibangun untuk komunitas anime Indonesia. Tersedia untuk{' '}
                <strong>Android</strong>, serta dukungan multi-platform.
              </p>

              <div className="hero-cta h-anim" style={{ ['--d' as string]: '.38s' }}>
                <a
                  className="btn btn-outline btn-big btn-hero-contact magnetic"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia"
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                >
                  <Mail />
                  <span>Contact Me</span>
                </a>
              </div>
            </div>

            {/* Animasi showcase interaktif (tanpa bingkai HP) */}
            <div className="stage h-anim" style={{ ['--d' as string]: '.4s' }}>
              <div className="phone-float">
                <div className="phone" id="phoneTilt" ref={phoneTiltRef}>
                  <div className="screen">
                    {/* Slide 1: Ajakan download */}
                    <div
                      className={`pscreen ${currentSlide === 0 ? 'on' : ''}`}
                      data-name="UNDUH"
                    >
                      <div className="promo">
                        <img
                          className="promo-logo"
                          src={LOGO_SRC}
                          onError={handleImgError}
                          alt="Logo Nuenime"
                          referrerPolicy="no-referrer"
                        />
                        <h4>
                          Nonton anime,
                          <br />
                          <span className="chrome">tanpa kompromi.</span>
                        </h4>
                        <p className="promo-tag">TERSEDIA UNTUK ANDROID</p>
                        <a className="p-btn-promo" href="#download">
                          <Download />
                          Download App
                        </a>
                      </div>
                    </div>

                    {/* Slide 2: Tombol download Android */}
                    <div
                      className={`pscreen ${currentSlide === 1 ? 'on' : ''}`}
                      data-name="ANDROID"
                    >
                      <div className="promo">
                        <h4>
                          Satu ketukan
                          <br />
                          <span className="chrome">menuju anime.</span>
                        </h4>
                        <p className="promo-tag">GRATIS · KHUSUS ANDROID</p>
                        <button
                          type="button"
                          className="p-btn-promo"
                          onClick={handleAndroidSlideDownloadClick}
                        >
                          <Smartphone />
                          Unduh untuk Android
                        </button>
                        <p className="promo-note">Nuenime · {versionInfo.badge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-dots" id="pDots">
                <button
                  type="button"
                  className={`p-dot ${currentSlide === 0 ? 'on' : ''}`}
                  aria-label="Slide unduh"
                  onClick={() => setCurrentSlide(0)}
                ></button>
                <button
                  type="button"
                  className={`p-dot ${currentSlide === 1 ? 'on' : ''}`}
                  aria-label="Slide Android"
                  onClick={() => setCurrentSlide(1)}
                ></button>
              </div>
              <p className="phone-cap" id="phoneCap">
                Nuenime · 0{currentSlide + 1}/02 — {slideNames[currentSlide]}
              </p>
            </div>
          </div>

          <div className="scroll-hint h-anim" style={{ ['--d' as string]: '.7s' }} aria-hidden="true">
            SCROLL<i></i>
          </div>
        </section>

        {/* ============ MARQUEE ============ */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track" id="mqTrack">
            <span className="mq-item">DOWNLOAD NOW</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item solid">Nuenime</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item">STREAMING ANIME</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item solid">GRATIS</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item">DOWNLOAD NOW</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item solid">Nuenime</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item">STREAMING ANIME</span>
            <span className="mq-sep">✦</span>
            <span className="mq-item solid">GRATIS</span>
            <span className="mq-sep">✦</span>
          </div>
        </div>

        {/* ============ DOWNLOAD ============ */}
        <section id="download">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="sec-idx">/ 01 — UNDUH</span>
              <h2 className="sec-title">
                Unduh Nuenime
                <br />
                Sekarang Juga.
              </h2>
              <p className="sec-sub">
                Satu aplikasi untuk semua anime favoritmu. Pilih sistem operasi perangkatmu untuk
                mengunduh rilis aplikasi resmi.
              </p>
            </div>

            <div className="dl-panel reveal" style={{ ['--d' as string]: '.12s' }}>
              <div className="dl-top">
                <div className="dl-brand">
                  <img
                    src={LOGO_SRC}
                    onError={handleImgError}
                    alt="Nuenime"
                    referrerPolicy="no-referrer"
                  />
                  <p>
                    {selectedPlatform === 'android'
                      ? 'APLIKASI ANDROID · RILIS RESMI'
                      : `VERSI ${currentPlatformInfo.label.toUpperCase()} · STATUS RILIS RESMI`}
                  </p>
                </div>
                <span className="dl-ver" data-testid="release-version-badge">
                  {versionInfo.badge}
                </span>
              </div>

              {/* 4-Platform Selector: Android, Windows, Linux, macOS */}
              <div className="dl-platform-label">PILIH PLATFORM SISTEM OPERASI</div>
              <div
                className="dl-platform-grid"
                role="tablist"
                aria-label="Pilih Sistem Operasi Unduhan"
              >
                {PLATFORM_LIST.map((plat) => {
                  const assetForPlat = selectPlatformAsset(latestRelease, plat.id, selectedArch);
                  const isAvailable = Boolean(assetForPlat);
                  const isSelected = selectedPlatform === plat.id;

                  return (
                    <button
                      key={plat.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`dl-platform-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectPlatform(plat.id)}
                    >
                      <div className="dl-platform-head">
                        {renderPlatformIcon(plat.id)}
                        <span
                          className={`dl-platform-status ${isAvailable ? 'ready' : 'unavail'}`}
                        >
                          {isAvailable ? 'TERSEDIA' : 'BELUM TERSEDIA'}
                        </span>
                      </div>
                      <span className="dl-platform-name">{plat.label}</span>
                      <span className="dl-platform-sub">
                        {isAvailable
                          ? `${versionInfo.badge} · ${formatBytesToMB(assetForPlat?.size || 0)}`
                          : 'Belum Tersedia'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Sub-panel: Android APK Architectures OR Desktop Unavailable Notice */}
              {selectedPlatform === 'android' ? (
                <div className="dl-arch-bar" role="group" aria-label="Pilih Varian Arsitektur APK">
                  <button
                    type="button"
                    className={`dl-arch-btn ${selectedArch === 'universal' ? 'active' : ''}`}
                    onClick={() => setSelectedArch('universal')}
                  >
                    <strong>
                      <span>UNIVERSAL APK</span>
                      <span>{formatBytesToMB(universalAsset?.size || 106742380)}</span>
                    </strong>
                    <span>Rekomendasi · Semua Android</span>
                  </button>
                  <button
                    type="button"
                    className={`dl-arch-btn ${selectedArch === 'arm64' ? 'active' : ''}`}
                    onClick={() => setSelectedArch('arm64')}
                  >
                    <strong>
                      <span>ARM64 APK</span>
                      <span>{formatBytesToMB(arm64Asset?.size || 104595762)}</span>
                    </strong>
                    <span>Android 64-bit Modern (v8a)</span>
                  </button>
                  <button
                    type="button"
                    className={`dl-arch-btn ${selectedArch === 'arm32' ? 'active' : ''}`}
                    onClick={() => setSelectedArch('arm32')}
                  >
                    <strong>
                      <span>ARM32 APK</span>
                      <span>{formatBytesToMB(arm32Asset?.size || 104218934)}</span>
                    </strong>
                    <span>Android 32-bit Lama (v7a)</span>
                  </button>
                </div>
              ) : !activePlatformAsset ? (
                <div className="dl-unavail-box" role="region" aria-live="polite">
                  <div className="dl-unavail-text">
                    <strong>
                      Versi {currentPlatformInfo.label} ({currentPlatformInfo.extensionsLabel}) Belum
                      Tersedia
                    </strong>
                    <p>
                      Pada rilis resmi terbaru ({versionInfo.badge}), paket instalasi untuk{' '}
                      <strong>{currentPlatformInfo.label}</strong> belum tersedia. Begitu file
                      installer {currentPlatformInfo.label} dirilis secara resmi, tombol unduh akan
                      langsung aktif secara otomatis.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedPlatform('android')}
                  >
                    <Smartphone />
                    <span>Pilih Versi Android</span>
                  </button>
                </div>
              ) : null}

              <div className="dl-actions">
                <button
                  type="button"
                  disabled={!activePlatformAsset}
                  className={`btn btn-big magnetic ${
                    activePlatformAsset ? 'btn-primary' : 'btn-disabled'
                  }`}
                  id="dlAndroid"
                  onClick={handleDownloadClick}
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                >
                  {activePlatformAsset ? renderPlatformIcon(selectedPlatform) : <Clock />}
                  <span>
                    {activePlatformAsset
                      ? selectedPlatform === 'android'
                        ? `Unduh untuk Android (${selectedArch.toUpperCase()})`
                        : `Unduh untuk ${currentPlatformInfo.label}`
                      : `Belum Tersedia untuk ${currentPlatformInfo.label}`}
                  </span>
                </button>
                <a
                  className="btn btn-outline btn-big magnetic"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia"
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                >
                  <Mail />
                  <span>Contact Me</span>
                </a>
              </div>

              <div className="dl-specs">
                <div className="dl-spec">
                  <span>VERSI</span>
                  <b data-testid="spec-version">
                    {activePlatformAsset ? versionInfo.clean : 'Belum Tersedia'}
                  </b>
                </div>
                <div className="dl-spec">
                  <span>UKURAN FILE</span>
                  <b data-testid="spec-size">
                    {activePlatformAsset
                      ? formatBytesToMB(activePlatformAsset.size)
                      : 'Belum Tersedia'}
                  </b>
                </div>
                <div className="dl-spec">
                  <span>PLATFORM</span>
                  <b data-testid="spec-platform">{currentPlatformInfo.label}</b>
                </div>
                <div className="dl-spec">
                  <span>STATUS RILIS</span>
                  <b data-testid="spec-status">
                    {activePlatformAsset ? 'Tersedia' : 'Belum Tersedia'}
                  </b>
                </div>
                <div className="dl-spec">
                  <span>HARGA</span>
                  <b>Gratis</b>
                </div>
              </div>


              <p className="dl-note">
                <ShieldCheck />
                <span>
                  UNDUH INSTALER RESMI HANYA DARI HALAMAN INI. BUTUH BANTUAN ATAU PERTANYAAN LAIN?
                  HUBUNGI{' '}
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    admin@nuenime.asia
                  </a>
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="wrap">
          <div className="foot-inner">
            <div className="foot-brand">
              <a className="logo" href="#hero" aria-label="Nuenime">
                <img
                  src={LOGO_SRC}
                  onError={handleImgError}
                  alt="Nuenime"
                  referrerPolicy="no-referrer"
                />
              </a>
              <p>
                Aplikasi streaming anime, donghua, movie gratis. Dibangun untuk komunitas anime
                Indonesia.
              </p>
            </div>
            <nav className="foot-nav" aria-label="Footer navigasi">
              <a href="#download">
                <Download />
                Unduh Aplikasi ({versionInfo.badge})
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail />
                admin@nuenime.asia
              </a>
              <a href="#hero">
                <ArrowUp />
                Kembali ke Atas
              </a>
            </nav>
          </div>
          <div className="foot-base">
            <span>© 2026 Nuenime. All rights reserved.</span>
            <span className="mono">RILIS RESMI · {versionInfo.badge} · NUEVA GROUP</span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <div id="toast" className={toastVisible ? 'show' : ''} role="status" aria-live="polite">
        <CheckCircle2 />
        <span id="toastMsg">{toastMessage}</span>
      </div>
    </div>
  );
}
