import './Portfolio.css';
import PageTurnerSticky from '../components/PageTurnerSticky.js';
import svg_profile from '../components/profile.svg';

import timg from '../02_portfolio/test.jpg';

// defalut
import img_defalut from '../02_portfolio/img_1.png';


// 1칸
import img2 from '../02_portfolio/img_2.png'
import img3 from '../02_portfolio/img_3.png'
import img6 from '../02_portfolio/img_6.png'
import img7 from '../02_portfolio/img_7.png'
import img8 from '../02_portfolio/img_8.png'
import img9 from '../02_portfolio/img_9.png'
import img10 from '../02_portfolio/img_10.png'
import img11 from '../02_portfolio/img_11.png'
import img14 from '../02_portfolio/img_14.png'
import img15 from '../02_portfolio/img_15.png'
import img17 from '../02_portfolio/img_17.png'
import img18 from '../02_portfolio/img_18.png'
import img19 from '../02_portfolio/img_19.png'
import img20 from '../02_portfolio/img_20.png'



// 2칸
import img4 from '../02_portfolio/img_4.png'
import img5 from '../02_portfolio/img_5.png'
import img12 from '../02_portfolio/img_12.png'
import img13 from '../02_portfolio/img_13.png'
import img16 from '../02_portfolio/img_16.png'



const COLUMNS = 7;
const ROWS = 7;
const TOTAL_CELLS = COLUMNS * ROWS;

// 셀별 이미지 편집
// 셀번호 : { src: 이미지 파일 컴포넌트, alt: 'Work 셀번호' }

// 1칸 이미지 편집
const singleCellConfig = {
  2: { src: img2, alt: 'Work 002' },
  3: { src: img3, alt: 'Work 003' },
  19: { src: img6, alt: 'Work 019' },
  20: { src: img7, alt: 'Work 020' },
  27: { src: img14, alt: 'Work 027' },
  28: { src: img8, alt: 'Work 028' },
  31: { src: img9, alt: 'Work 031' },
  32: { src: img15, alt: 'Work 032' },
  36: { src: img18, alt: 'Work 036' },
  37: { src: img19, alt: 'Work 037' },
  38: { src: img20, alt: 'Work 038' },
  43: { src: img10, alt: 'Work 043' },
  44: { src: img17, alt: 'Work 044' },
  47: { src: img11, alt: 'Work 047' },
  
};

// 2칸 이미지 편집
// span: 2 이면 가로 2칸 이미지 (오른쪽 칸과 병합)
const doubleCellConfig = {
  5: { src: img12, span: 2, alt: 'Work 005' },
  8: { src: img16, span: 2, alt: 'Work 008' },
  13: { src: timg, span: 2, alt: 'Work 013' },
  16: { src: img4, span: 2, alt: 'Work 016' },
  22: { src: img5, span: 2, alt: 'Work 022' },
  40: { src: img13, span: 2, alt: 'Work 040' },
};

const cellConfig = {
  ...singleCellConfig,
  ...doubleCellConfig,
};

function pad3(num) {
  return String(num).padStart(3, '0');
}

function buildGridItems() {
  const blocked = new Set();
  const items = [];

  for (let cell = 1; cell <= TOTAL_CELLS; cell += 1) {
    if (blocked.has(cell)) continue;

    const conf = cellConfig[cell] || {};
    const wantsSpan2 = conf.span === 2;
    const colSpan = wantsSpan2 ? 2 : 1;

    if (colSpan === 2) {
      blocked.add(cell + 1);
    }

    items.push({
      cell,
      label: pad3(cell),
      colSpan,
      src: conf.src || img_defalut,
      alt: conf.alt || `Work ${pad3(cell)}`,
    });
  }

  return items;
}

const gridItems = buildGridItems();

function Portfolio() {
  return (
    <div className="portfolio-page">
      <div className="portfolio-scroll">
        <section className="portfolio-grid" aria-label="Portfolio Grid">
          {gridItems.map((item) => (
            <article
              key={item.cell}
              className={`portfolio-item ${item.colSpan === 2 ? 'portfolio-item--span2' : ''}`}
              style={{
                gridColumn: item.colSpan === 2 ? 'span 2' : 'span 1',
              }}
            >
              <span className="portfolio-item__index">{`【 ${item.label} 】`}</span>
              <img
                className="portfolio-item__img"
                src={item.src}
                alt={item.alt}
                loading="lazy"
              />
            </article>
          ))}
        </section>
      </div>

      <PageTurnerSticky navOffset={39}
        titleSvgSrc={svg_profile}
        titleSvgAlt='PROFILE'
        backgroundColor='#8fcb64' />



      <div className='portfolio_1'>

      </div>

    </div>
  );
}

export default Portfolio;
