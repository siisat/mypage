import './Home.css';
import PageTurnerSticky from '../components/PageTurnerSticky.js'
import img from './profile.png'
import svg_profile from '../components/profile.svg'


function Home() {
  return (
    <div className="main">
      
      {/* 히어로 화면 */}
      <div className='hero'>
        <p className='hero_title_1'>Hello World!</p>
        <p className='hero_title_2'>Hallo Welt!</p>
        <p className='hero_title_3'>こんにちは、世界!</p>
      </div>

      <PageTurnerSticky navOffset={39}
        titleSvgSrc={svg_profile}
        titleSvgAlt='PROFILE'
        backgroundColor='#4696FF' />

      <div className='profile'>
        <div className='profile_img_box'>
          <img src={img} alt='profile' className='img'/>
        </div>

        <div className='profile_info'>
          <h3 className='name'>세린</h3>

          <div className='tools'>
            <button className='btn'>Figma</button>
            <button className='btn'>HTML</button>
            <button className='btn'>CSS</button>
            <button className='btn'>JS</button>
            <button className='btn'>Python</button>
            <button className='btn'>Photoshop</button>
            <button className='btn'>Illustrator</button>
          </div>
        </div>


      </div>

    </div>
  );
}

export default Home;