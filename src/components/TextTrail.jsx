// src/components/TextTrail.jsx - 간격 넓히고 단순화
import { useEffect, useState } from 'react';

export default function TextTrail({ 
  message = "Hello", 
  count = 25,
  trailTime = 4
}) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    let id;
    const move = (e) => {
      const pos = { x: e.clientX, y: e.clientY };
      setPositions(p => {
        const newP = [pos, ...p.slice(0, count - 1)];
        return newP;
      });
    };
    
    document.addEventListener('mousemove', move);
    id = setInterval(() => {
      setPositions(p => p.slice(0, count));
    }, 200);  // 간격 넓힘 (120 → 200ms)
    
    return () => {
      document.removeEventListener('mousemove', move);
      clearInterval(id);
    };
  }, [count]);

  return (
    <>
      {positions.map((pos, i) => {
        const charIndex = Math.floor(i * 1.5) % message.length;  // 간격 더 넓힘
        const char = message[charIndex];
        
        return (
          <div
            key={`${i}-${char}`}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%)`,
              color: '#ff4e21',
              fontSize: '24px',
              fontWeight: '700',
              zIndex: 9999 - i,
              pointerEvents: 'none',
              lineHeight: 1,
              letterSpacing: '20px'  // 글자 간격
            }}
          >
            {char}
          </div>
        );
      })}
    </>
  );
}
