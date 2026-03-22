import { useEffect } from 'react';
import './Home.css';
import img from './profile.png'

function Home() {
    useEffect(() => {
    const lens = document.querySelector('.lens');
    if (!lens) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const speed = 0.08; // 0.08~0.2

    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      lens.style.left = `${currentX}px`;
      lens.style.top = `${currentY}px`;

      requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', move, { passive: true });
    const raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);


  return (
    <div className="main">

      <div className='profile'>
        <div className='profile_img_box'>
          <img src={img} alt='profile' className='img'/>
        </div>

        <div className='profile_info'>
          <h3 className='name'>세린</h3>
          <p className='major'>화학과 전공</p>
          <p className='major'>임베디드소프트웨어 연계전공</p>
        </div>
      </div>

      <div className='center_texts'>
        <p className='t_small'>Premiere pro</p>
        <p className='t_big'>Figma</p>
        <p className='t_small'>Photoshop</p>
        <p className='t_small'>Lightroom</p>
        <p className='t_big'>JavaScript</p>
        <p className='t_small'>CSS</p>
        <p className='t_small'>HTML</p>
        <p className='t_small'>Illustrator</p>
        <p className='t_big'>Python</p>
        <p className='t_small'>Github</p>
      </div>

      <div className='hero'>
        <p className='hero_title_1'>Hello World!</p>
        <p className='hero_title_3'>こんにちは、世界!</p>
        <p className='hero_title_2'>Hallo Welt!</p>
      </div>

      <div className="lens" aria-hidden="true" />
    </div>
  );
}

export default Home;
