import { useEffect } from 'react';
import './MiniCursor.css';

function MiniCursor() {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    const area = document.getElementById('invert-area');

    if (!cursor || !area) return undefined;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    const LERP = 0.25;

    const animate = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;

      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;

      rafId = window.requestAnimationFrame(animate);
    };

    const clearSlideClasses = () => {
      cursor.classList.remove('is-slide-left', 'is-slide-right');
    };

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const leftHit = e.target.closest('.slide-hit--left');
      const rightHit = e.target.closest('.slide-hit--right');

      clearSlideClasses();
      if (leftHit && !leftHit.disabled && !leftHit.classList.contains('is-disabled')) {
        cursor.classList.add('is-slide-left');
      } else if (rightHit && !rightHit.disabled && !rightHit.classList.contains('is-disabled')) {
        cursor.classList.add('is-slide-right');
      }
    };

    const onLeave = () => {
      cursor.style.opacity = '0';
      cursor.classList.remove('is-slide-left', 'is-slide-right');
    };

    const onEnter = () => {
      cursor.style.opacity = '1';
    };

    area.addEventListener('mousemove', onMove);
    area.addEventListener('mouseleave', onLeave);
    area.addEventListener('mouseenter', onEnter);

    onEnter();
    rafId = window.requestAnimationFrame(animate);

    return () => {
      area.removeEventListener('mousemove', onMove);
      area.removeEventListener('mouseleave', onLeave);
      area.removeEventListener('mouseenter', onEnter);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return <div id="custom-cursor" className="invert-cursor" aria-hidden="true" />;
}

export default MiniCursor;
