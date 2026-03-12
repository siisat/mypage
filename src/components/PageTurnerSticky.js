import React, { useEffect, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax - inMin === 0) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
}

function PageTurnerSticky({
  navOffset = 39,
  title = 'PROFILE',
  titleSvgSrc = '',
  titleSvgAlt = 'Section Title',
  backgroundColor = '#7f7f7f',
}) {
  const sectionRef = useRef(null);

  const [bgY, setBgY] = useState(100);
  const [titleY, setTitleY] = useState(44);
  const [titleScaleY, setTitleScaleY] = useState(1);
  const [titleOpacity, setTitleOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const p = clamp(-rect.top / scrollable, 0, 1);

      // Background motion: rise -> hold -> exit up
      const BG_FILL_END = 0.16;
      const BG_HOLD_END = 0.84;

      let nextBgY;
      if (p < BG_FILL_END) {
        nextBgY = mapRange(p, 0, BG_FILL_END, 100, 0);
      } else if (p < BG_HOLD_END) {
        nextBgY = 0;
      } else {
        nextBgY = mapRange(p, BG_HOLD_END, 1, 0, -100);
      }

      // Title motion:
      // 1) Start near center and move upward
      // 2) Stick below header and compress vertically
      // 3) Exit upward
      const MOVE_END = 0.62;
      const SHRINK_END = 0.88;

      let nextTitleY;
      let nextTitleScaleY;
      let nextTitleOpacity;

      if (p < MOVE_END) {
        nextTitleY = mapRange(p, 0, MOVE_END, 44, 0);
        nextTitleScaleY = 1;
        nextTitleOpacity = 1;
      } else if (p < SHRINK_END) {
        nextTitleY = 0;
        nextTitleScaleY = mapRange(p, MOVE_END, SHRINK_END, 1, 0.34);
        nextTitleOpacity = 1;
      } else {
        nextTitleY = mapRange(p, SHRINK_END, 1, 0, -120);
        nextTitleScaleY = 0.34;
        nextTitleOpacity = mapRange(p, SHRINK_END, 1, 1, 0);
      }

      setBgY(nextBgY);
      setTitleY(nextTitleY);
      setTitleScaleY(nextTitleScaleY);
      setTitleOpacity(nextTitleOpacity);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: backgroundColor,
            transform: `translate3d(0, ${bgY}%, 0)`,
            willChange: 'transform',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: navOffset,
            left: 0,
            right: 0,
            color: '#000000',
            opacity: titleOpacity,
            transformOrigin: 'top center',
            transform: `translate3d(0, ${titleY}vh, 0) scaleY(${titleScaleY})`,
            willChange: 'transform, opacity',
          }}
        >
          {titleSvgSrc ? (
            <img
              src={titleSvgSrc}
              alt={titleSvgAlt}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          ) : (
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(140px, 26vw, 520px)',
                lineHeight: 0.82,
                letterSpacing: '-0.03em',
                fontWeight: 900,
                textTransform: 'uppercase',
                whiteSpace: 'pre-line',
                textAlign: 'center',
              }}
            >
              {title}
            </h2>
          )}
        </div>
      </div>
    </section>
  );
}

export default PageTurnerSticky;
