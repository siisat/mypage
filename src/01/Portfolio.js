import './Portfolio.css';
import fallbackImage from './profile.png';
import timg from '../02_portfolio/test.jpg';

const COLUMNS = 7;
const ROWS = 7;
const TOTAL_CELLS = COLUMNS * ROWS;

// 셀별 이미지/확장 설정: key는 1~49 셀 번호
// span: 2 이면 가로 2칸 이미지 (오른쪽 칸과 병합)

// 2칸 이미지 편집
const cellConfig = {
  5: { src: timg, span: 2, alt: 'Work 005' },
  13: { src: timg, span: 2, alt: 'Work 013' },
  22: { src: timg, span: 2, alt: 'Work 022' },
  31: { src: timg, span: 2, alt: 'Work 031' },
  40: { src: timg, span: 2, alt: 'Work 040' },
};

function pad3(num) {
  return String(num).padStart(3, '0');
}

function buildGridItems() {
  const blocked = new Set();
  const items = [];

  for (let cell = 1; cell <= TOTAL_CELLS; cell += 1) {
    if (blocked.has(cell)) continue;

    const row = Math.floor((cell - 1) / COLUMNS) + 1;
    const col = ((cell - 1) % COLUMNS) + 1;

    const conf = cellConfig[cell] || {};
    const wantsSpan2 = conf.span === 2;
    const canSpan2 = wantsSpan2 && col < COLUMNS && cell < TOTAL_CELLS;
    const colSpan = canSpan2 ? 2 : 1;

    if (colSpan === 2) {
      blocked.add(cell + 1);
    }

    items.push({
      cell,
      label: pad3(cell),
      row,
      col,
      colSpan,
      src: conf.src || fallbackImage,
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
                gridColumn: `${item.col} / span ${item.colSpan}`,
                gridRow: item.row,
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
    </div>
  );
}

export default Portfolio;
