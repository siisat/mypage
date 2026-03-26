import React, { useMemo, useState } from 'react';
import './ProjectPanelSection.css';

function ProjectPanelSection({
  slides = [],
  title = '타이틀',
  descriptionLines = ['기획 설명 간단히', '기획 설명 간단히'],
  tools = '사용한 툴',
  contribution = '기획 00% · 디자인 00% · 개발 00%',
  ctaLabel = 'Prototype',
  ctaHref = '',
}) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasSlides = safeSlides.length > 0;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === safeSlides.length - 1;

  const goPrev = () => {
    if (!hasSlides || isFirst) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    if (!hasSlides || isLast) return;
    setCurrentIndex((prev) => Math.min(prev + 1, safeSlides.length - 1));
  };

  return (
    <section className="project-panel-section">
      <div className="project-panel-layout">
        <div className="project-media-wrap" aria-label="Project Slide">
          <div className="project-slider-frame">
            {hasSlides ? (
              <div
                className="project-slider-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {safeSlides.map((src, idx) => (
                  <img
                    key={`${src}-${idx}`}
                    className="project-slide"
                    src={src}
                    alt={`Project slide ${idx + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <div className="project-slide project-slide--empty">
                슬라이드 이미지를 추가해 주세요
              </div>
            )}

            <button
              type="button"
              className={`slide-hit slide-hit--left ${isFirst || !hasSlides ? 'is-disabled' : ''}`}
              onClick={goPrev}
              disabled={isFirst || !hasSlides}
              aria-label="Previous slide"
            />
            <button
              type="button"
              className={`slide-hit slide-hit--right ${isLast || !hasSlides ? 'is-disabled' : ''}`}
              onClick={goNext}
              disabled={isLast || !hasSlides}
              aria-label="Next slide"
            />
          </div>
        </div>

        <aside className="project-info">
          <h3 className="project-info__title">{title}</h3>
          <p className="project-info__desc">
            {descriptionLines.map((line, idx) => (
              <React.Fragment key={`${line}-${idx}`}>
                {line}
                {idx !== descriptionLines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </p>
          <p className="project-info__tools">{tools}</p>
          <p className="project-info__contribution">{contribution}</p>

          {ctaHref ? (
            <a
              className="project-info__cta minicursor_tg"
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
             
            >
              {ctaLabel}
            </a>
          ) : (
            <p className="project-info__cta minicursor_tg">{ctaLabel}</p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default ProjectPanelSection;
