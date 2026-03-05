import React, { useEffect, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax - inMin === 0) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
}

function PageTurner({
  eyebrow = 'Next Section',
  title = 'Profile',
  backgroundColor = '#00cd4b',
  textColor = '#ffffff',
}) {
  const sectionRef = useRef(null);
  const [bgTranslateY, setBgTranslateY] = useState(100);
  const [textOpacity, setTextOpacity] = useState(0);
  const [textTranslateY, setTextTranslateY] = useState(48);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const p = clamp(-rect.top / scrollable, 0, 1);

      // 1) 하단에서 색 배경이 차오름 2) 유지 3) 상단으로 밀려 사라짐
      const FILL_END = 0.30;
      const HOLD_END = 0.76;

      let y;
      if (p < FILL_END) {
        y = mapRange(p, 0, FILL_END, 100, 0);
      } else if (p < HOLD_END) {
        y = 0;
      } else {
        y = mapRange(p, HOLD_END, 1, 0, -100);
      }

      // 텍스트: 색 배경 위에서 나타나고, 배경이 사라질 때 함께 사라짐
      const textIn = mapRange(p, 0.08, 0.24, 0, 1);
      const textOut = mapRange(p, 0.70, 0.92, 1, 0);
      const opacity = Math.min(textIn, textOut);
      const textY = mapRange(opacity, 0, 1, 48, 0);

      setBgTranslateY(y);
      setTextOpacity(opacity);
      setTextTranslateY(textY);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      style={{
        position: 'relative',
        height: '360vh',
        overflow: 'clip',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          pointerEvents: 'none',
          zIndex: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: backgroundColor,
            transform: `translate3d(0, ${bgTranslateY}%, 0)`,
            willChange: 'transform',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: textColor,
            opacity: textOpacity,
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
            transition: 'opacity 140ms linear',
            willChange: 'opacity, transform',
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              {eyebrow}
            </p>
            <h2
              style={{
                margin: '16px 0 0',
                fontSize: 'clamp(36px, 8vw, 110px)',
                lineHeight: 1,
                fontWeight: 700,
                whiteSpace: 'pre-line',
              }}
            >
              {title}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageTurner;
