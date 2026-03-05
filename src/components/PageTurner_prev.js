import React, { useEffect, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function PageTurner() {
  const sectionRef = useRef(null);
  const [fillProgress, setFillProgress] = useState(0); // 0 -> 1
  const [liftProgress, setLiftProgress] = useState(0); // 0 -> 1

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          ticking = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          ticking = false;
          return;
        }

        // 섹션 진행도: 0(진입) -> 1(이탈)
        const sectionProgress = clamp(-rect.top / scrollable, 0, 1);

        // 1) 아래에서 위로 초록색이 차오름
        // 2) 화면 전체 초록색 유지(이전보다 길게)
        // 3) 초록색 블록이 위로 올라가며 사라짐
        const FILL_END = 0.24;
        const HOLD_END = 0.80;

        let nextFill = 1;
        let nextLift = 0;

        if (sectionProgress < FILL_END) {
          nextFill = sectionProgress / FILL_END;
        } else if (sectionProgress < HOLD_END) {
          nextFill = 1;
        } else {
          nextFill = 1;
          nextLift = (sectionProgress - HOLD_END) / (1 - HOLD_END);
        }

        setFillProgress(clamp(nextFill, 0, 1));
        setLiftProgress(clamp(nextLift, 0, 1));
        ticking = false;
      });
    };

    handleScroll();
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
      className="rising-section"
      aria-hidden="true"
      style={{
        position: 'relative',
        height: '360vh',
      }}
    >
      <div
        className="rising-rect"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#00cd4b',
          transformOrigin: 'bottom center',
          transform: `translateY(${-liftProgress * 100}%) scaleY(${fillProgress})`,
          willChange: 'transform',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </section>
  );
}

export default PageTurner;
