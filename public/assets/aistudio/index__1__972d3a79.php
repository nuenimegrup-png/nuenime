<?php /* Nuenime — Landing + Download — single file */ ?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nuenime</title>
<meta name="description" content="Nuenime — aplikasi streaming anime untuk gratis Oleh Nueva Group">
<link rel="icon" type="image/png" href="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png">
<link rel="apple-touch-icon" href="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* ============ DASAR & VARIABEL ============ */
:root{
  --bg:#060606;
  --bg2:#0a0a0a;
  --txt:#ededed;
  --dim:#8f8f8f;
  --faint:#5c5c5c;
  --line:rgba(255,255,255,.08);
  --silver:#c9c9c9;
  --mono:'JetBrains Mono',monospace;
  --disp:'Unbounded',sans-serif;
  --body:'Space Grotesk',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:92px}
body{
  background:var(--bg);color:var(--txt);
  font-family:var(--body);font-size:16px;line-height:1.6;
  overflow-x:hidden;-webkit-font-smoothing:antialiased;
}
::selection{background:#e0e0e0;color:#000}
::-webkit-scrollbar{width:10px}
::-webkit-scrollbar-track{background:#060606}
::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:6px}
::-webkit-scrollbar-thumb:hover{background:#3d3d3d}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer}
.mono{font-family:var(--mono)}
.wrap{width:min(1160px,92%);margin:0 auto}
section{position:relative}

/* Kilau chrome — identitas silver Nuenime */
.chrome{
  background:linear-gradient(100deg,#fff 0%,#9c9c9c 28%,#f4f4f4 50%,#7d7d7d 72%,#e6e6e6 100%);
  background-size:220% 100%;
  -webkit-background-clip:text;background-clip:text;color:transparent;
  animation:sheen 7s linear infinite;
}
@keyframes sheen{0%{background-position:220% 0}100%{background-position:-220% 0}}

/* Grain film halus di atas segalanya */
.grain{
  position:fixed;inset:-60%;z-index:90;pointer-events:none;opacity:.045;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>");
  animation:grain .9s steps(2) infinite;
}
@keyframes grain{
  0%,100%{transform:translate(0,0)}25%{transform:translate(-1.5%,1%)}
  50%{transform:translate(1%,-1.5%)}75%{transform:translate(-1%,-.5%)}
}

/* ============ PRELOADER ============ */
#preloader{
  position:fixed;inset:0;z-index:200;background:var(--bg);
  display:grid;place-items:center;
  transition:opacity .6s ease .15s,visibility .6s .15s;
}
body.loaded #preloader{opacity:0;visibility:hidden}
.pre-inner{display:flex;flex-direction:column;align-items:center}
.pre-logo-img{height:76px;width:auto;animation:logoBreath 1.6s ease-in-out infinite}
@keyframes logoBreath{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}
.pre-text{
  font-family:var(--disp);font-weight:800;font-size:14px;color:var(--txt);
  letter-spacing:.42em;margin-top:22px;text-indent:.42em;
  animation:track 1.2s cubic-bezier(.2,.7,.2,1) both;
}
@keyframes track{from{letter-spacing:.95em;opacity:0}to{letter-spacing:.42em;opacity:1}}
.pre-bar{width:190px;height:2px;background:#1e1e1e;margin-top:18px;overflow:hidden}
.pre-bar em{display:block;height:100%;width:0;background:#e8e8e8;animation:load 1.35s cubic-bezier(.6,.05,.3,1) forwards}
@keyframes load{to{width:100%}}

/* Animasi masuk hero setelah preloader */
.h-anim{
  opacity:0;transform:translateY(26px);
  transition:opacity .9s cubic-bezier(.2,.7,.2,1) var(--d,0s),transform .9s cubic-bezier(.2,.7,.2,1) var(--d,0s);
}
body.loaded .h-anim{opacity:1;transform:none}

/* ============ NAVIGASI ============ */
nav.top{
  position:fixed;inset-inline:0;top:0;z-index:80;height:74px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(20px,5vw,56px);
  transition:background .35s,border-color .35s,backdrop-filter .35s;
  border-bottom:1px solid transparent;
}
nav.top.scrolled{background:rgba(6,6,6,.78);backdrop-filter:blur(14px);border-bottom-color:var(--line)}
.logo{display:flex;align-items:center;gap:12px}
.logo img{height:34px;width:auto}
.logo-text{font-family:var(--disp);font-weight:700;font-size:14px;letter-spacing:.24em}
.nav-links{display:flex;gap:34px}
.nav-links a{font-size:14px;color:var(--dim);position:relative;transition:color .3s}
.nav-links a::after{
  content:'';position:absolute;left:0;bottom:-6px;height:1px;width:0;
  background:var(--silver);transition:width .35s cubic-bezier(.2,.7,.2,1);
}
.nav-links a:hover{color:#fff}
.nav-links a:hover::after{width:100%}

/* ============ TOMBOL ============ */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:11px;
  font-family:var(--body);font-weight:600;font-size:15px;
  padding:15px 28px;border-radius:8px;border:1px solid transparent;
  transition:transform .3s,background .3s,color .3s,border-color .3s,box-shadow .3s;
  will-change:transform;
}
.btn svg{width:17px;height:17px}
.btn-primary{position:relative;overflow:hidden;background:#e9e9e9;color:#0a0a0a}
.btn-primary::after{
  content:'';position:absolute;top:0;left:-75%;width:45%;height:100%;
  background:linear-gradient(105deg,transparent,rgba(255,255,255,.95),transparent);
  transform:skewX(-20deg);transition:left .55s ease;
}
.btn-primary:hover{background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.55)}
.btn-primary:hover::after{left:135%}
.btn-primary:active{transform:scale(.98)}
.btn-outline{background:transparent;color:var(--silver);border-color:rgba(255,255,255,.22)}
.btn-outline:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.4)}
.btn-sm{padding:11px 20px;font-size:13.5px}
.btn-big{padding:17px 34px;font-size:16px;border-radius:10px}
.btn-big svg{width:19px;height:19px}

/* ============ HERO ============ */
.hero{
  min-height:100svh;display:flex;align-items:center;
  padding:150px 0 110px;overflow:hidden;position:relative;
}
#spotlight{
  position:absolute;top:0;left:0;width:640px;height:640px;z-index:0;pointer-events:none;
  background:radial-gradient(circle,rgba(255,255,255,.065),transparent 62%);
}
.hero-grid{
  position:absolute;left:-12%;right:-12%;bottom:-2px;height:46vh;z-index:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);
  background-size:46px 46px;
  transform:perspective(520px) rotateX(62deg) scale(1.5);
  transform-origin:bottom;
  -webkit-mask-image:linear-gradient(to top,rgba(0,0,0,.9),transparent 82%);
  mask-image:linear-gradient(to top,rgba(0,0,0,.9),transparent 82%);
  animation:gridMove 2.6s linear infinite;
}
@keyframes gridMove{from{background-position:0 0}to{background-position:0 46px}}
.plus{
  position:absolute;font-family:var(--mono);font-size:20px;
  color:rgba(255,255,255,.15);pointer-events:none;user-select:none;z-index:1;
}
.hero-inner{
  display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(34px,5vw,72px);
  align-items:center;position:relative;z-index:2;
}
.hero h1{
  font-family:var(--disp);font-weight:800;
  font-size:clamp(2.4rem,5.6vw,4.4rem);line-height:1.06;letter-spacing:-.01em;
  margin:0 0 24px;
}
.hero-sub{color:var(--dim);max-width:530px;font-size:clamp(15px,1.4vw,17px)}
.hero-sub strong{color:var(--txt);font-weight:600}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:42px}
.scroll-hint{
  position:absolute;bottom:26px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:10px;z-index:2;
  font-family:var(--mono);font-size:9px;letter-spacing:.4em;color:var(--faint);
}
.scroll-hint i{width:1px;height:44px;background:rgba(255,255,255,.15);position:relative;overflow:hidden;display:block}
.scroll-hint i::after{
  content:'';position:absolute;top:-50%;left:0;width:100%;height:50%;
  background:#e8e8e8;animation:scrollLine 1.8s cubic-bezier(.6,.05,.3,1) infinite;
}
@keyframes scrollLine{to{top:110%}}

/* ============ MOCKUP PONSEL — SLIDE PROMO UNDUHAN ============ */
.stage{perspective:1300px;display:flex;flex-direction:column;align-items:center;gap:20px}
.phone-float{animation:floaty 6.5s ease-in-out infinite}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
.phone{
  width:min(292px,78vw);aspect-ratio:9/19;border-radius:40px;
  border:1px solid rgba(255,255,255,.2);background:#0b0b0b;padding:9px;
  box-shadow:0 40px 100px rgba(0,0,0,.75),inset 0 0 0 3px #050505;
  position:relative;
}
.notch{
  position:absolute;top:17px;left:50%;transform:translateX(-50%);
  width:78px;height:18px;background:#040404;border-radius:0 0 12px 12px;z-index:9;
}
.screen{height:100%;border-radius:32px;overflow:hidden;position:relative;background:#0a0a0a}
.p-status{
  position:absolute;top:0;left:0;right:0;z-index:8;
  display:flex;justify-content:space-between;align-items:center;
  padding:14px 22px 0;font-family:var(--mono);font-size:10.5px;color:#bbb;
}
.p-status .ic{display:flex;gap:5px}
.p-status svg{width:11px;height:11px}
.pscreen{
  position:absolute;inset:0;padding:54px 14px 18px;
  opacity:0;transform:translateY(14px) scale(.985);
  transition:opacity .45s ease,transform .45s ease;pointer-events:none;
}
.pscreen.on{opacity:1;transform:none;pointer-events:auto}
.promo{
  height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;position:relative;padding:0 8px;
}
.promo::before{
  content:'';position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);
  background-size:22px 22px;
  -webkit-mask-image:radial-gradient(circle at 50% 42%,#000,transparent 78%);
  mask-image:radial-gradient(circle at 50% 42%,#000,transparent 78%);
}
.promo > *{
  position:relative;opacity:0;transform:translateY(12px);
  transition:opacity .5s ease,transform .5s ease;
}
.pscreen.on .promo > *{opacity:1;transform:none}
.pscreen.on .promo > *:nth-child(1){transition-delay:.12s}
.pscreen.on .promo > *:nth-child(2){transition-delay:.24s}
.pscreen.on .promo > *:nth-child(3){transition-delay:.36s}
.pscreen.on .promo > *:nth-child(4){transition-delay:.48s}
.promo-logo{height:58px;width:auto;margin-bottom:24px}
.promo h4{font-family:var(--disp);font-weight:700;font-size:17px;line-height:1.35;margin-bottom:12px}
.promo-tag{font-family:var(--mono);font-size:8.5px;letter-spacing:.24em;color:#7d7d7d;margin-bottom:30px}
.p-btn-promo{
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  background:#e9e9e9;color:#000;border-radius:10px;padding:12px 22px;
  font-weight:600;font-size:12.5px;transition:background .25s,transform .25s;
}
.p-btn-promo:hover{background:#fff;transform:translateY(-2px)}
.p-btn-promo svg{width:15px;height:15px}
.promo-note{font-family:var(--mono);font-size:8px;letter-spacing:.26em;color:#5f5f5f;margin-top:24px}
.p-dots{display:flex;gap:9px}
.p-dot{width:8px;height:8px;border-radius:50%;background:#2e2e2e;border:none;transition:all .3s;padding:0}
.p-dot.on{background:#eee;transform:scale(1.25)}
.phone-cap{font-family:var(--mono);font-size:9.5px;letter-spacing:.24em;color:var(--faint)}

/* ============ MARQUEE ============ */
.marquee{overflow:hidden;border-block:1px solid var(--line);padding:20px 0;background:var(--bg2)}
.marquee-track{display:flex;align-items:center;width:max-content;animation:scrollX 30s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes scrollX{to{transform:translateX(-50%)}}
.mq-item{
  font-family:var(--disp);font-weight:700;font-size:clamp(1.9rem,4vw,3.2rem);
  color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.28);
  white-space:nowrap;padding:0 26px;
}
.mq-item.solid{color:#1c1c1c;-webkit-text-stroke:0}
.mq-sep{font-size:clamp(1rem,2vw,1.5rem);color:#575757}

/* ============ SECTION DOWNLOAD ============ */
#download{padding:clamp(90px,12vw,140px) 0 clamp(100px,13vw,150px)}
.sec-head{display:flex;align-items:flex-end;gap:26px;flex-wrap:wrap;margin-bottom:clamp(40px,6vw,60px)}
.sec-idx{font-family:var(--mono);font-size:11px;letter-spacing:.26em;color:var(--faint);padding-bottom:10px}
.sec-title{font-family:var(--disp);font-weight:700;font-size:clamp(1.6rem,3.4vw,2.6rem);line-height:1.14;letter-spacing:-.01em}
.sec-sub{color:var(--dim);max-width:440px;margin-left:auto;font-size:14.5px;padding-bottom:4px}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .85s cubic-bezier(.2,.7,.2,1) var(--d,0s),transform .85s cubic-bezier(.2,.7,.2,1) var(--d,0s)}
.reveal.on{opacity:1;transform:none}
.dl-panel{
  max-width:780px;border:1px solid rgba(255,255,255,.14);border-radius:20px;
  background:linear-gradient(180deg,#0d0d0d,#090909);
  padding:clamp(26px,4vw,44px);
  box-shadow:0 34px 90px rgba(0,0,0,.55);
  position:relative;overflow:hidden;
}
.dl-panel::before{
  content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);
}
.dl-top{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.dl-top img{height:64px;width:auto}
.dl-meta{flex:1;min-width:180px}
.dl-meta h3{font-family:var(--disp);font-weight:700;font-size:clamp(1.2rem,2.4vw,1.6rem)}
.dl-meta p{font-family:var(--mono);font-size:9.5px;letter-spacing:.26em;color:var(--faint);margin-top:7px}
.dl-ver{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--silver);
  border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:8px 14px;
}
.dl-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}
.dl-actions .btn{flex:1;min-width:230px}
.dl-specs{display:flex;flex-wrap:wrap;margin-top:30px;border-top:1px solid var(--line)}
.dl-spec{flex:1;min-width:130px;padding:18px 18px 0;border-left:1px solid var(--line)}
.dl-spec:first-child{border-left:none;padding-left:0}
.dl-spec span{display:block;font-family:var(--mono);font-size:9px;letter-spacing:.22em;color:var(--faint);margin-bottom:7px}
.dl-spec b{font-size:14px;font-weight:600;color:var(--silver)}
.dl-note{
  display:flex;gap:10px;align-items:flex-start;margin-top:32px;
  font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--faint);line-height:1.9;
}
.dl-note svg{width:15px;height:15px;flex:none;margin-top:4px;color:var(--silver)}
.dl-note a{color:var(--silver);border-bottom:1px solid rgba(255,255,255,.25);transition:color .3s}
.dl-note a:hover{color:#fff}

/* ============ FOOTER ============ */
footer{border-top:1px solid var(--line);padding:58px 0 34px}
.foot-inner{display:flex;justify-content:space-between;gap:44px;flex-wrap:wrap;align-items:flex-start}
.foot-brand .logo img{height:36px}
.foot-brand p{color:var(--dim);font-size:13.5px;margin-top:18px;line-height:1.75;max-width:300px}
.foot-nav{display:flex;flex-direction:column;gap:12px}
.foot-nav a{color:var(--dim);font-size:14px;transition:color .3s;display:inline-flex;align-items:center;gap:9px}
.foot-nav a:hover{color:#fff}
.foot-nav svg{width:14px;height:14px}
.foot-base{
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  margin-top:48px;padding-top:22px;border-top:1px solid var(--line);
  font-size:12px;color:var(--faint);
}
.foot-base .mono{font-size:10px;letter-spacing:.2em}

/* ============ TOAST ============ */
#toast{
  position:fixed;right:22px;bottom:22px;z-index:120;
  display:flex;align-items:center;gap:12px;
  background:#111;border:1px solid rgba(255,255,255,.18);border-radius:10px;
  padding:15px 20px;font-size:14px;max-width:380px;
  box-shadow:0 22px 60px rgba(0,0,0,.65);
  transform:translateY(150%);transition:transform .5s cubic-bezier(.2,.8,.25,1);
}
#toast.show{transform:translateY(0)}
#toast svg{width:19px;height:19px;color:#e8e8e8;flex:none}

/* ============ RESPONSIF ============ */
@media (max-width:980px){
  .nav-links{display:none}
  .hero-inner{grid-template-columns:1fr}
  .stage{margin-top:30px}
  .sec-sub{margin-left:0}
  .scroll-hint{display:none}
}
@media (max-width:600px){
  .hero{padding-top:126px}
  .dl-actions .btn{min-width:100%}
  .dl-spec{min-width:calc(50% - 18px);padding-left:0;border-left:none;margin-top:10px}
  #toast{left:16px;right:16px;max-width:none}
}
</style>
</head>
<body>

<!-- Preloader -->
<div id="preloader">
  <div class="pre-inner">
    <img class="pre-logo-img" src="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png" alt="Nuenime">
    <div class="pre-text">Nuenime</div>
    <div class="pre-bar"><em></em></div>
  </div>
</div>

<!-- Grain film -->
<div class="grain" aria-hidden="true"></div>

<!-- Navigasi -->
<nav class="top" id="topNav">
  <a class="logo" href="#hero" aria-label="Nuenime">
    <img src="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png" alt="Logo Nuenime">
    <span class="logo-text">Nuenime</span>
  </a>
  <div class="nav-links">
    <a href="#download">Unduh</a>
    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia" target="_blank" rel="noopener">Kontak</a>
  </div>
  <a class="btn btn-outline btn-sm" href="#download"><i data-lucide="download"></i>Download</a>
</nav>

<main>
<!-- ============ HERO ============ -->
<section class="hero" id="hero">
  <div id="spotlight" aria-hidden="true"></div>
  <div class="hero-grid" aria-hidden="true"></div>
  <span class="plus" style="top:16%;left:5%" aria-hidden="true">+</span>
  <span class="plus" style="bottom:24%;right:7%" aria-hidden="true">+</span>
  <span class="plus" style="top:58%;left:46%" aria-hidden="true">+</span>

  <div class="wrap hero-inner">

    <div>
      <h1 class="h-anim" style="--d:.1s">Nonton anime,<br><span class="chrome">tanpa kompromi.</span></h1>
      <p class="hero-sub h-anim" style="--d:.24s">
        <strong>Nuenime</strong> — aplikasi streaming anime yang bersih, cepat, dan mobile-first.
        Dibangun untuk komunitas anime Indonesia. Tersedia untuk <strong>Android</strong>.
      </p>

      <div class="hero-cta h-anim" style="--d:.38s">
        <a class="btn btn-primary btn-big magnetic" href="#download"><i data-lucide="download"></i>Download App</a>
        <a class="btn btn-outline btn-big magnetic" href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia" target="_blank" rel="noopener"><i data-lucide="mail"></i>Contact Me</a>
      </div>
    </div>

    <!-- Mockup ponsel: slide ajakan unduh (bukan isi aplikasi — masih rahasia) -->
    <div class="stage h-anim" style="--d:.4s">
      <div class="phone-float">
        <div class="phone" id="phoneTilt">
          <div class="notch"></div>
          <div class="screen">
            <div class="p-status">
              <span>21:47</span>
              <span class="ic"><i data-lucide="signal"></i><i data-lucide="wifi"></i><i data-lucide="battery-full"></i></span>
            </div>

            <!-- Slide 1: Ajakan download -->
            <div class="pscreen on" data-name="UNDUH">
              <div class="promo">
                <img class="promo-logo" src="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png" alt="Logo Nuenime">
                <h4>Nonton anime,<br><span class="chrome">tanpa kompromi.</span></h4>
                <p class="promo-tag">TERSEDIA UNTUK ANDROID</p>
                <a class="p-btn-promo" href="#download"><i data-lucide="download"></i>Download App</a>
              </div>
            </div>

            <!-- Slide 2: Tombol download Android -->
            <div class="pscreen" data-name="ANDROID">
              <div class="promo">
                <h4>Satu ketukan<br><span class="chrome">menuju anime.</span></h4>
                <p class="promo-tag">GRATIS · KHUSUS ANDROID</p>
                <a class="p-btn-promo" href="#download"><i data-lucide="smartphone"></i>Unduh untuk Android</a>
                <p class="promo-note">Nuenime · V1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-dots" id="pDots">
        <button class="p-dot on" aria-label="Slide unduh"></button>
        <button class="p-dot" aria-label="Slide Android"></button>
      </div>
      <p class="phone-cap" id="phoneCap">Nuenime · 01/02 — UNDUH</p>
    </div>

  </div>

  <div class="scroll-hint h-anim" style="--d:.7s" aria-hidden="true">SCROLL<i></i></div>
</section>

<!-- ============ MARQUEE ============ -->
<div class="marquee" aria-hidden="true">
  <div class="marquee-track" id="mqTrack">
    <span class="mq-item">DOWNLOAD NOW</span><span class="mq-sep">✦</span>
    <span class="mq-item solid">Nuenime</span><span class="mq-sep">✦</span>
    <span class="mq-item">STREAMING ANIME</span><span class="mq-sep">✦</span>
    <span class="mq-item solid">GRATIS</span><span class="mq-sep">✦</span>
  </div>
</div>

<!-- ============ DOWNLOAD ============ -->
<section id="download">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="sec-idx">/ 01 — UNDUH</span>
      <h2 class="sec-title">Unduh Nuenime<br>Sekarang Juga.</h2>
      <p class="sec-sub">Satu aplikasi untuk semua anime favoritmu. Gratis, Tanpa Iklan, dan dibangun khusus untuk Android.</p>
    </div>

    <div class="dl-panel reveal" style="--d:.12s">
      <div class="dl-top">
        <img src="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png" alt="Logo Nuenime">
        <div class="dl-meta">
          <h3>Nuenime</h3>
          <p>APLIKASI ANDROID</p>
        </div>
        <span class="dl-ver">V1.0.0</span>
      </div>

      <div class="dl-actions">
        <!-- Ganti href="#" di bawah dengan URL file APK Nuenime saat rilis -->
        <a class="btn btn-primary btn-big magnetic" id="dlAndroid" href="#"><i data-lucide="smartphone"></i>Unduh untuk Android</a>
        <a class="btn btn-outline btn-big magnetic" href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia" target="_blank" rel="noopener"><i data-lucide="mail"></i>Contact Me</a>
      </div>

      <div class="dl-specs">
        <div class="dl-spec"><span>VERSI</span><b>1.0.0</b></div>
        <div class="dl-spec"><span>PLATFORM</span><b>Android</b></div>
        <div class="dl-spec"><span>BAHASA</span><b>Indonesia</b></div>
        <div class="dl-spec"><span>HARGA</span><b>Gratis</b></div>
      </div>

      <p class="dl-note">
        <i data-lucide="shield-check"></i>
        <span>
          UNDUH APK RESMI HANYA DARI HALAMAN INI. BUTUH BANTUAN ATAU PERTANYAAN LAIN?
          HUBUNGI <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia" target="_blank" rel="noopener">admin@nuenime.asia</a>
        </span>
      </p>
    </div>
  </div>
</section>
</main>

<!-- ============ FOOTER ============ -->
<footer>
  <div class="wrap">
    <div class="foot-inner">
      <div class="foot-brand">
        <a class="logo" href="#hero">
          <img src="https://ai.wearecosplayer.my.id/assets/images/nue-ai-v2.png" alt="Logo Nuenime">
          <span class="logo-text">Nuenime</span>
        </a>
        <p>Aplikasi streaming anime, donghua, movie gratis. Dibangun untuk komunitas anime Indonesia.</p>
      </div>
      <nav class="foot-nav">
        <a href="#download"><i data-lucide="download"></i>Unduh Aplikasi</a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@nuenime.asia" target="_blank" rel="noopener"><i data-lucide="mail"></i>admin@nuenime.asia</a>
        <a href="#hero"><i data-lucide="arrow-up"></i>Kembali ke Atas</a>
      </nav>
    </div>
    <div class="foot-base">
      <span>© 2026 Nuenime. All rights reserved.</span>
    </div>
  </div>
</footer>

<!-- Toast -->
<div id="toast" role="status"><i data-lucide="check-circle-2"></i><span id="toastMsg"></span></div>

<script src="https://unpkg.com/lucide@latest"></script>
<script>
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const icons = () => { if (window.lucide) lucide.createIcons(); };
icons();

/* ---------- Preloader ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.body.classList.add('loaded'), 1500);
});

/* ---------- Nav: status scroll ---------- */
addEventListener('scroll', () => $('#topNav').classList.toggle('scrolled', scrollY > 40), { passive: true });

/* ---------- Mockup ponsel: ganti slide otomatis + manual ---------- */
const screens = $$('.pscreen');
const dots    = $$('#pDots .p-dot');
const cap     = $('#phoneCap');
let cur = 0, pTimer;
function goScreen(i) {
  cur = (i + screens.length) % screens.length;
  screens.forEach((sc, k) => sc.classList.toggle('on', k === cur));
  dots.forEach((d, k) => d.classList.toggle('on', k === cur));
  cap.textContent = `Nuenime · 0${cur + 1}/0${screens.length} — ${screens[cur].dataset.name}`;
}
function autoScreen() { clearInterval(pTimer); pTimer = setInterval(() => goScreen(cur + 1), 4200); }
dots.forEach((d, k) => d.addEventListener('click', () => { goScreen(k); autoScreen(); }));
autoScreen();

/* ---------- Tilt ponsel + sorotan kursor (perangkat pointer halus) ---------- */
if (matchMedia('(pointer:fine)').matches) {
  const stage = $('#phoneTilt'), hero = $('#hero'), spot = $('#spotlight');
  let tx = 0, ty = 0, cx = 0, cy = 0;
  let mx = -700, my = -700, sx = -700, sy = -700;
  hero.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)));
    ty = Math.max(-1, Math.min(1, (e.clientY - (r.top  + r.height / 2)) / (r.height / 2)));
    mx = e.clientX; my = e.clientY;
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; mx = -700; my = -700; });
  (function loop() {
    cx += (tx - cx) * .07;  cy += (ty - cy) * .07;
    sx += (mx - sx) * .12;  sy += (my - sy) * .12;
    stage.style.transform = `rotateY(${cx * 9}deg) rotateX(${-cy * 7}deg)`;
    spot.style.transform   = `translate(${sx - 320}px, ${sy - 320}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ---------- Marquee: duplikasi agar berjalan mulus tanpa putus ---------- */
const mq = $('#mqTrack');
mq.innerHTML += mq.innerHTML;

/* ---------- Reveal saat scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } });
}, { threshold: .12 });
 $$('.reveal').forEach(el => io.observe(el));

/* ---------- Tombol magnetik: tertarik halus ke arah kursor ---------- */
if (matchMedia('(pointer:fine)').matches) {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width  / 2)) / r.width;
      const y = (e.clientY - (r.top  + r.height / 2)) / r.height;
      btn.style.transform = `translate(${x * 7}px, ${y * 6}px)`;
    });
    btn.addEventListener('pointerleave', () => btn.style.transform = '');
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  $('#toastMsg').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3800);
}

/* ---------- Tombol unduh Android: fallback jika URL APK belum diisi ---------- */
 $('#dlAndroid').addEventListener('click', e => {
  if ($('#dlAndroid').getAttribute('href') === '#') {
    e.preventDefault();
    showToast('Tautan unduhan APK akan aktif saat rilis resmi — pantau terus halaman ini.');
  }
});
</script>
</body>
</html>