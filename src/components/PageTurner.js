import React, { useEffect, useState } from 'react';

function PageTurner() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
        const section = document.getElementById('rising-section');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 섹션 전체 진행도: 0(시작) ~ 1(끝)
        const total = windowHeight * 2;         // rising-section 높이가 200vh일 때 기준
        const rawProgress = (windowHeight - rect.top) / total;
        const p = Math.min(1, Math.max(0, rawProgress));

        // A: 0~0.3 → 0~1 로 증가
        // B: 0.3~0.7 → 1 유지
        // C: 0.7~1 → 1~0 로 감소
        let value;

        if (p < 0.3) {
            value = p / 0.3;              // 0 ~ 1
        } else if (p < 0.9) {
            value = 1;                    // 유지 구간
        } else {
            value = (1 - p) / 0.3;        // 1 ~ 0
        }

        setProgress(value);
    };


    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="rising-section"
      className="rising-section"
    >
      <div
        className="rising-rect"
        style={{
            transform: `scaleY(${progress})`,
        }}
        />
    </section>
  );
}

export default PageTurner;
