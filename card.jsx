/* ============================================================
   Neha & Prajwal — Wedding Invitation
   Multi-section animated envelope card
   ============================================================ */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- SVG Decorations ---------- */

const FloralCorner = ({ color = '#c9a96e' }) => (
  <svg className="corner-floral" viewBox="0 0 64 64">
    {/* Curved stem */}
    <path d="M2 62 C 8 50, 18 38, 28 30 C 38 22, 48 14, 60 4"
          stroke={color} strokeWidth="0.9" fill="none" opacity="0.85"/>
    {/* Leaves */}
    <path d="M14 44 C 8 42, 6 36, 10 30 C 16 34, 18 40, 14 44 Z"
          fill={color} opacity="0.4"/>
    <path d="M28 30 C 22 28, 20 22, 24 16 C 30 20, 32 26, 28 30 Z"
          fill={color} opacity="0.35"/>
    <path d="M44 16 C 38 14, 36 8, 40 2 C 46 6, 48 12, 44 16 Z"
          fill={color} opacity="0.45"/>
    {/* Rose buds */}
    <g transform="translate(20,52)">
      <circle r="3.2" fill="#c97d8e" opacity="0.7"/>
      <circle r="1.8" fill="#a85267" opacity="0.85"/>
      <circle r="0.8" fill="#fdf6f0" opacity="0.9"/>
    </g>
    <g transform="translate(36,36)">
      <circle r="2.6" fill="#e8b4b8" opacity="0.7"/>
      <circle r="1.4" fill="#c97d8e" opacity="0.85"/>
    </g>
    <g transform="translate(52,18)">
      <circle r="3.5" fill="#c97d8e" opacity="0.7"/>
      <circle r="2" fill="#a85267" opacity="0.85"/>
      <circle r="0.9" fill="#fdf6f0" opacity="0.9"/>
    </g>
    {/* Small leaves */}
    <ellipse cx="8" cy="56" rx="3" ry="1.4" fill={color} opacity="0.4" transform="rotate(-30 8 56)"/>
    <ellipse cx="56" cy="10" rx="3" ry="1.4" fill={color} opacity="0.4" transform="rotate(-30 56 10)"/>
  </svg>
);

const FloralLetterCorner = () => (
  <svg className="corner" viewBox="0 0 36 36">
    <path d="M2 34 C 6 26, 12 18, 20 12 C 26 8, 30 4, 34 2"
          stroke="#c9a96e" strokeWidth="0.7" fill="none" opacity="0.7"/>
    <circle cx="12" cy="22" r="1.8" fill="#c97d8e" opacity="0.7"/>
    <circle cx="22" cy="12" r="2.2" fill="#a85267" opacity="0.7"/>
    <ellipse cx="6" cy="28" rx="2" ry="1" fill="#c9a96e" opacity="0.5" transform="rotate(-25 6 28)"/>
  </svg>
);

/* Newari torana (cusped arch) — palace decoration */
const Torana = () => (
  <svg className="torana" viewBox="0 0 320 36" preserveAspectRatio="none">
    {/* Main cusped arch line */}
    <path d="M 4 34 Q 4 4 24 4 Q 40 4 44 16 Q 56 4 72 4 Q 88 4 92 16 Q 104 4 120 4 Q 136 4 140 16 Q 152 4 168 4 Q 184 4 188 16 Q 200 4 216 4 Q 232 4 236 16 Q 248 4 264 4 Q 280 4 284 16 Q 296 4 316 4 Q 316 34 316 34"
          stroke="#c9a96e" strokeWidth="1.1" fill="none" opacity="0.85"/>
    {/* Inner dashed arch */}
    <path d="M 10 34 Q 10 10 28 10 Q 44 10 48 20 Q 60 10 76 10 Q 92 10 96 20 Q 108 10 124 10 Q 140 10 144 20 Q 156 10 172 10 Q 188 10 192 20 Q 204 10 220 10 Q 236 10 240 20 Q 252 10 268 10 Q 284 10 288 20 Q 300 10 310 10"
          stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.5" strokeDasharray="2 3"/>
    {/* Hanging gold dots */}
    {Array.from({length: 12}).map((_, i) => (
      <circle key={i} cx={20 + i * 26} cy="22" r="1.2" fill="#c9a96e" opacity="0.7"/>
    ))}
    {/* Central ornament */}
    <g transform="translate(160 6)">
      <path d="M 0 0 L -4 6 L 0 12 L 4 6 Z" fill="#c9a96e" opacity="0.85"/>
      <circle r="1.5" fill="#a85267"/>
    </g>
  </svg>
);

/* Ornamental rule between sections */
const Ornament = () => (
  <div className="ornament" aria-hidden="true">
    <span className="ornament-line"></span>
    <span className="ornament-diamond"></span>
    <span className="ornament-line"></span>
  </div>
);

/* Detail row icons */
const IconCal = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M3 9h18M8 3v4M16 3v4"/>
    <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3.5 2"/>
  </svg>
);
const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M12 22s8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);

/* ---------- Envelope ---------- */

const Envelope = ({ onOpen }) => {
  const [state, setState] = useState('closed'); // closed | opening | gone

  const handleOpen = () => {
    if (state !== 'closed') return;
    setState('opening');
    setTimeout(() => {
      setState('gone');
      onOpen();
    }, 1400);
  };

  return (
    <div className="stage">
      <div
        className={`envelope-wrap ${state}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
        aria-label="Tap to open invitation"
      >
        <div className="envelope">
          <div className="envelope-border"></div>
        </div>

        {/* Letter peeking from inside */}
        <div className="letter-peek">
          <FloralLetterCorner />
          <div className="corner tl"><FloralLetterCorner /></div>
          <div className="corner tr"><FloralLetterCorner /></div>
          <div className="corner bl"><FloralLetterCorner /></div>
          <div className="corner br"><FloralLetterCorner /></div>
          <div className="peek-subtitle">YOU ARE INVITED</div>
          <div className="peek-rule"></div>
          <div className="peek-monogram">Neha &amp; Prajwal</div>
          <div className="peek-rule"></div>
          <div className="peek-subtitle">27 · JUNE · 2026</div>
          <div className="peek-hint">TAP TO OPEN</div>
        </div>

        <div className="envelope-pocket"></div>
        <div className="envelope-flap">
          <div className="wax-seal">N<span style={{fontSize:'14px',margin:'0 2px',color:'#f5d4d4'}}>♥</span>P</div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Section wrapper with intersection-observer reveal ---------- */

const Section = ({ children, delay = 0, withTorana = false }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`section ${visible ? 'visible' : ''}`}>
      <div className="section-frame"></div>
      {withTorana && <Torana />}
      <FloralCorner />
      <div className="corner-floral tr"><FloralCorner /></div>
      <div className="corner-floral bl"><FloralCorner /></div>
      <div className="corner-floral br"><FloralCorner /></div>
      {children}
    </div>
  );
};

/* ---------- Cover Section ---------- */

const Cover = () => (
  <Section withTorana>
    <div className="cover-title">TOGETHER WITH THEIR FAMILIES</div>
    <p className="cover-invite">
      <em>with hearts full of joy &amp; gratitude,</em><br/>
      we joyfully invite you to celebrate<br/>
      the wedding of
    </p>
    <div className="names">
      <span className="first">Neha</span>
      <span className="amp">&amp;</span>
      <span className="second">Prajwal</span>
    </div>
    <Ornament />
    <div className="date-pill">
      <div className="date-day">SATURDAY</div>
      <div className="date-number">27</div>
      <div className="date-month">JUNE · 2026</div>
      <div className="date-bs">Ashar 13, 2083 B.S.</div>
    </div>
    <Ornament />
    <p className="cover-invite" style={{fontSize:'13px', marginBottom:'8px'}}>
      <em>at Yala Durbar, Sankhamul</em>
    </p>
  </Section>
);

/* ---------- Couple Portrait Section ---------- */

const CouplePortrait = () => (
  <Section>
    <div className="section-eyebrow">THE BELOVED COUPLE</div>
    <div className="section-heading">Two Souls</div>
    <div className="section-eyebrow" style={{marginTop:'2px'}}>ONE JOURNEY</div>

    <div className="portrait-frame">
      <div className="portrait-arch">
        <img src="assets/couple.jpg" alt="Neha and Prajwal" />
      </div>
    </div>

    <p className="quote">
      <span className="glyph">&ldquo;</span> In all the world, there is no heart for me like yours.<br/>
      In all the world, there is no love for you like mine. <span className="glyph">&rdquo;</span>
    </p>
    <Ornament />
    <div className="quote-attr">N · &amp; · P</div>
  </Section>
);

/* ---------- Countdown Section ---------- */

const useCountdown = (target) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
};

const Countdown = () => {
  // June 27, 2026, 11:00 AM local
  const target = useMemo(() => new Date('2026-06-27T11:00:00').getTime(), []);
  const { days, hours, minutes, seconds } = useCountdown(target);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <Section>
      <div className="section-eyebrow">COUNTING THE DAYS</div>
      <div className="section-heading">Until We Say I Do</div>
      <div className="countdown-grid">
        <div className="cd-cell">
          <div className="cd-num">{pad(days)}</div>
          <div className="cd-label">DAYS</div>
        </div>
        <div className="cd-cell">
          <div className="cd-num">{pad(hours)}</div>
          <div className="cd-label">HOURS</div>
        </div>
        <div className="cd-cell">
          <div className="cd-num">{pad(minutes)}</div>
          <div className="cd-label">MIN</div>
        </div>
        <div className="cd-cell">
          <div className="cd-num">{pad(seconds)}</div>
          <div className="cd-label">SEC</div>
        </div>
      </div>
      <Ornament />
      <p className="cover-invite" style={{fontSize:'14px', margin:'4px 18px 0'}}>
        <em>every moment brings us closer to forever</em>
      </p>
    </Section>
  );
};

/* ---------- Event Details Section ---------- */

const Details = () => (
  <Section>
    <div className="section-eyebrow">SAVE THE DATE</div>
    <div className="section-heading">The Celebration</div>

    <div style={{marginTop:'24px'}}>
      <div className="detail-row">
        <div className="detail-icon"><IconCal /></div>
        <div>
          <div className="detail-key">DATE</div>
          <div className="detail-val">Saturday, 27 June 2026</div>
          <div className="detail-sub">Ashar 13, 2083 B.S.</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="detail-icon"><IconClock /></div>
        <div>
          <div className="detail-key">TIME</div>
          <div className="detail-val">11:00 AM onwards</div>
          <div className="detail-sub">Reception to follow at 6 PM</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="detail-icon"><IconPin /></div>
        <div>
          <div className="detail-key">VENUE</div>
          <div className="detail-val">Yala Durbar</div>
          <div className="detail-sub">Sankhamul, Lalitpur</div>
        </div>
      </div>
    </div>

    <div className="map-link-wrap">
      <a className="map-link" href="https://maps.google.com/?q=Yala+Durbar+Sankhamul" target="_blank" rel="noopener noreferrer">
        VIEW ON MAP
      </a>
    </div>
  </Section>
);

/* ---------- Closing Section ---------- */

const Closing = ({ onClose }) => (
  <Section>
    <div className="section-eyebrow">WITH LOVE</div>
    <p className="closing-quote">
      <em>Your presence is the greatest gift we could ask for as we begin our forever.</em>
    </p>
    <Ornament />
    <div className="signature">Neha &amp; Prajwal</div>
    <div className="close-back">
      <button onClick={onClose}>RE-SEAL THE ENVELOPE</button>
    </div>
  </Section>
);

/* ---------- Tweaks ---------- */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "blush-rose",
  "showHearts": true,
  "showTorana": true
}/*EDITMODE-END*/;

const PALETTES = {
  "blush-rose": { cream:'#fdf6f0', blush:'#e8b4b8', rose:'#c97d8e', wine:'#5b2334', gold:'#c9a96e' },
  "champagne":  { cream:'#fbf4ea', blush:'#e9cfb6', rose:'#c89a78', wine:'#6b3a26', gold:'#b8924d' },
  "berry":      { cream:'#fbf1f3', blush:'#e8a6b6', rose:'#b85a78', wine:'#4a1530', gold:'#c79754' },
  "sage-rose":  { cream:'#f7f3ec', blush:'#d9c8b8', rose:'#b48a76', wine:'#4a3a2c', gold:'#9c8a5a' }
};

const Tweaks = ({ tweaks, setTweak }) => {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakColor, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Palette">
        <TweakColor
          label="Mood"
          value={tweaks.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            ['#e8b4b8','#c97d8e','#5b2334','#c9a96e'],
            ['#e9cfb6','#c89a78','#6b3a26','#b8924d'],
            ['#e8a6b6','#b85a78','#4a1530','#c79754'],
            ['#d9c8b8','#b48a76','#4a3a2c','#9c8a5a']
          ]}
          optionLabels={['Blush Rose','Champagne','Berry','Sage Rose']}
        />
      </TweakSection>
      <TweakSection title="Decoration">
        <TweakToggle label="Floating hearts" value={tweaks.showHearts} onChange={(v)=>setTweak('showHearts', v)} />
        <TweakToggle label="Newari torana" value={tweaks.showTorana} onChange={(v)=>setTweak('showTorana', v)} />
      </TweakSection>
    </TweaksPanel>
  );
};

/* ---------- App ---------- */

const App = () => {
  const [opened, setOpened] = useState(false);
  const useTweaksHook = window.useTweaks || (() => [TWEAK_DEFAULTS, () => {}]);
  const [tweaks, setTweak] = useTweaksHook(TWEAK_DEFAULTS);

  // Resolve palette index
  const paletteKey = tweaks.palette && typeof tweaks.palette === 'object'
    ? (['blush-rose','champagne','berry','sage-rose'][
        [['#e8b4b8','#c97d8e','#5b2334','#c9a96e'],
         ['#e9cfb6','#c89a78','#6b3a26','#b8924d'],
         ['#e8a6b6','#b85a78','#4a1530','#c79754'],
         ['#d9c8b8','#b48a76','#4a3a2c','#9c8a5a']].findIndex(p => JSON.stringify(p) === JSON.stringify(tweaks.palette))
      ] || 'blush-rose')
    : (tweaks.palette || 'blush-rose');

  useEffect(() => {
    const p = PALETTES[paletteKey] || PALETTES['blush-rose'];
    const root = document.documentElement;
    root.style.setProperty('--cream', p.cream);
    root.style.setProperty('--blush', p.blush);
    root.style.setProperty('--rose', p.rose);
    root.style.setProperty('--rose-deep', p.wine);
    root.style.setProperty('--wine', p.wine);
    root.style.setProperty('--gold', p.gold);
    document.getElementById('ambient').style.display = tweaks.showHearts ? '' : 'none';
  }, [paletteKey, tweaks.showHearts]);

  const handleClose = () => {
    setOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!opened) {
    return (
      <>
        <Envelope onOpen={() => setOpened(true)} />
        <Tweaks tweaks={tweaks} setTweak={setTweak} />
      </>
    );
  }

  return (
    <>
      <div className="card-wrap">
        <Cover />
        <CouplePortrait />
        <Countdown />
        <Details />
        <Closing onClose={handleClose} />
      </div>
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
