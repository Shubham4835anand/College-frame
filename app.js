/**
 * ============================================================================
 *  SPEAKER SHOWCASE — INTERACTIVE EDITORIAL RENDERER
 *  Reads all content from `window.SPEAKER_DATA` (data.js)
 * ============================================================================
 */

(function () {
  "use strict";

  const data = window.SPEAKER_DATA;
  if (!data) {
    console.error("SPEAKER_DATA not found. Make sure data.js loads before app.js.");
    return;
  }

  // State
  let activeEra = "All";
  let allLessonsExpanded = false;
  let chapterObserver = null;

  // Helpers
  const $ = (id) => document.getElementById(id);
  const setText = (id, text) => {
    const el = $(id);
    if (el && text !== undefined) el.textContent = text;
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ==========================================================================
     1. POPULATE STATIC EDITORIAL CONTENT FROM data.js
     ========================================================================== */
  function hydrateContent() {
    document.title = data.meta.siteTitle || `${data.speaker.name} — Speaker Showcase`;

    // Masthead
    setText("masthead-name", data.speaker.shortName || data.speaker.name);
    setText("masthead-issue", data.meta.issueNumber);

    // Hero
    setText("issue-label", data.meta.issueLabel);
    setText(
      "event-meta",
      `${data.event.venue} · ${data.event.date}`.toUpperCase()
    );
    setText("alumni-badge", data.event.alumniBadge);
    setText("talk-title", data.event.talkTitle);
    setText("talk-subtitle", data.event.talkSubtitle);
    setText("hero-speaker-name", data.speaker.name);
    setText(
      "hero-speaker-role",
      `${data.speaker.role} · ${data.speaker.company}`
    );
    setText("hero-college-name", data.event.collegeName);
    setText("hero-short-intro", data.speaker.shortIntro);

    // Speaker portrait & caption
    const photoEl = $("speaker-photo");
    if (photoEl && data.speaker.photo) {
      photoEl.src = data.speaker.photo;
      photoEl.alt = `${data.speaker.name} — ${data.speaker.role}`;
    }
    setText("speaker-photo-caption", data.speaker.photoCaption);

    // Quick facts grid
    const factsEl = $("quick-facts");
    if (factsEl && Array.isArray(data.speaker.quickFacts)) {
      factsEl.innerHTML = data.speaker.quickFacts
        .map(
          (fact) => `
          <div class="facts-grid__item">
            <dt>${escapeHtml(fact.label)}</dt>
            <dd>${escapeHtml(fact.value)}</dd>
          </div>
        `
        )
        .join("");
    }

    // Editorial letter (Slide 2: About Me)
    setText("letter-lead", `“${data.speaker.letterLead}”`);
    setText("letter-sig-name", `— ${data.speaker.firstName || data.speaker.name}`);
    setText("letter-sig-meta", (data.speaker.handle || data.event.alumniBadge).toUpperCase());

    const letterBodyEl = $("letter-body");
    if (letterBodyEl && Array.isArray(data.speaker.letterBody)) {
      letterBodyEl.innerHTML = data.speaker.letterBody
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");
    }

    // Busting the Myth (Slides 3 & 4)
    if (data.philosophy) {
      setText("myth-eyebrow", data.philosophy.eyebrow);
      setText("myth-heading", data.philosophy.heading);
      setText("myth-subheading", data.philosophy.subheading);
      setText("myth-lead", data.philosophy.lead);

      const mythList = $("myth-insights");
      if (mythList && Array.isArray(data.philosophy.insights)) {
        mythList.innerHTML = data.philosophy.insights
          .map(
            (item) => `
            <div class="myth-card reveal">
              <div class="myth-card__num">INSIGHT ${escapeHtml(item.number)}</div>
              <h3 class="myth-card__title">${escapeHtml(item.title)}</h3>
              <p class="myth-card__body">${escapeHtml(item.body)}</p>
            </div>
          `
          )
          .join("");
      }
    }

    // T-Shirt Portfolio Showcase (Slide 10)
    const tshirtGrid = $("tshirt-grid");
    if (tshirtGrid && Array.isArray(data.tshirtPortfolio)) {
      tshirtGrid.innerHTML = data.tshirtPortfolio
        .map(
          (item) => `
          <article class="tshirt-card reveal">
            <div class="tshirt-card__img-wrap">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="tshirt-card__img" loading="lazy" />
            </div>
            <h4 class="tshirt-card__title">${escapeHtml(item.title)}</h4>
            <div class="tshirt-card__specs">${escapeHtml(item.specs)}</div>
            <p class="tshirt-card__desc">${escapeHtml(item.desc)}</p>
          </article>
        `
        )
        .join("");
    }

    // Night Club Logo Case Study (Slide 8)
    if (data.logoCaseStudy) {
      setText("logo-eyebrow", data.logoCaseStudy.eyebrow);
      setText("logo-title", data.logoCaseStudy.title);
      setText("logo-lead", data.logoCaseStudy.lead);

      const logoContainer = $("logo-concepts");
      if (logoContainer && Array.isArray(data.logoCaseStudy.concepts)) {
        logoContainer.innerHTML = data.logoCaseStudy.concepts
          .map(
            (c) => `
            <div class="logo-concept-card">
              <div class="logo-concept-card__step">${escapeHtml(c.step)}</div>
              <h4 class="logo-concept-card__name">${escapeHtml(c.name)}</h4>
              <div class="logo-concept-card__formula">${escapeHtml(c.formula)}</div>
              <p class="logo-concept-card__desc">${escapeHtml(c.desc)}</p>
            </div>
          `
          )
          .join("");
      }
    }

    // 6 Lessons for Juniors (Slide 13)
    if (data.keyLessons) {
      setText("lessons-eyebrow", data.keyLessons.eyebrow);
      setText("lessons-heading", data.keyLessons.heading);

      const lessonsGrid = $("lessons-grid");
      if (lessonsGrid && Array.isArray(data.keyLessons.items)) {
        lessonsGrid.innerHTML = data.keyLessons.items
          .map(
            (lesson) => `
            <div class="lesson-box reveal">
              <div class="lesson-box__num">LESSON ${escapeHtml(lesson.number)}</div>
              <h3 class="lesson-box__title">${escapeHtml(lesson.title)}</h3>
              <p class="lesson-box__body">${escapeHtml(lesson.body)}</p>
            </div>
          `
          )
          .join("");
      }
    }

    // Notes to Students / Guiding Rules (Slide 14)
    if (data.notesToStudents) {
      setText("notes-eyebrow", data.notesToStudents.eyebrow);
      setText("notes-heading", data.notesToStudents.heading);
      const notesGrid = $("notes-grid");
      if (notesGrid && Array.isArray(data.notesToStudents.items)) {
        notesGrid.innerHTML = data.notesToStudents.items
          .map(
            (item) => `
            <article class="note-card reveal">
              <span class="note-card__num" aria-hidden="true">${escapeHtml(item.number)}</span>
              <h3 class="note-card__title">${escapeHtml(item.title)}</h3>
              <p class="note-card__body">${escapeHtml(item.body)}</p>
            </article>
          `
          )
          .join("");
      }
    }

    // Connect Hub
    if (data.connect) {
      setText("connect-eyebrow", data.connect.eyebrow);
      setText("connect-heading", data.connect.heading);
      setText("connect-subtext", data.connect.subtext);

      const linksContainer = $("connect-links");
      if (linksContainer && Array.isArray(data.connect.links)) {
        linksContainer.innerHTML = data.connect.links
          .map(
            (link) => `
            <a
              class="connect-link-row"
              href="${escapeHtml(link.url)}"
              ${link.url.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener noreferrer"'}
            >
              <div class="connect-link-row__left">
                <span class="connect-link-row__label">${escapeHtml(link.label)}</span>
                <span class="connect-link-row__note">${escapeHtml(link.note || "")}</span>
              </div>
              <span class="connect-link-row__right">
                <span>${escapeHtml(link.handle)}</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          `
          )
          .join("");
      }
    }

    // Footer colophon
    setText("footer-speaker-name", data.speaker.name);
    setText("footer-event-name", data.event.talkTitle);
  }

  /* ==========================================================================
     2. JOURNEY TIMELINE, ERA FILTERS & STICKY CHAPTER RAIL
     ========================================================================== */
  function renderEraFilters() {
    const container = $("era-filters");
    if (!container) return;

    const eras = ["All", ...new Set(data.timeline.map((c) => c.era))];

    container.innerHTML = eras
      .map(
        (era) => `
        <button
          type="button"
          role="tab"
          aria-selected="${era === activeEra ? "true" : "false"}"
          class="era-pill ${era === activeEra ? "is-active" : ""}"
          data-era="${escapeHtml(era)}"
        >
          ${era === "All" ? "All Chapters" : escapeHtml(era)}
        </button>
      `
      )
      .join("");

    container.querySelectorAll(".era-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeEra = btn.dataset.era;
        renderEraFilters();
        renderTimeline();
      });
    });
  }

  function renderTimeline() {
    const timelineEl = $("timeline-container");
    const railEl = $("chapter-rail-list");
    if (!timelineEl || !railEl) return;

    const chapters =
      activeEra === "All"
        ? data.timeline
        : data.timeline.filter((c) => c.era === activeEra);

    // Sticky chapter rail
    railEl.innerHTML = chapters
      .map(
        (ch, idx) => `
        <li>
          <button
            type="button"
            class="rail-item ${idx === 0 ? "is-active" : ""}"
            data-target="${escapeHtml(ch.id)}"
          >
            <span class="rail-item__meta">CH. ${escapeHtml(ch.chapterNumber)} · ${escapeHtml(ch.period)}</span>
            <span class="rail-item__title">${escapeHtml(ch.title)}</span>
          </button>
        </li>
      `
      )
      .join("");

    railEl.querySelectorAll(".rail-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Timeline cards
    timelineEl.innerHTML = chapters
      .map((ch, idx) => {
        const isOpen = allLessonsExpanded || idx === 0;
        const tagsHtml = (ch.tags || [])
          .map((t) => `<span class="chapter-tag">${escapeHtml(t)}</span>`)
          .join("");

        return `
          <article
            class="chapter-card reveal ${idx === 0 ? "is-current" : ""}"
            id="${escapeHtml(ch.id)}"
            data-chapter-index="${idx}"
          >
            <header class="chapter-card__header">
              <div class="chapter-card__eyebrow">
                <span class="chapter-num">Chapter ${escapeHtml(ch.chapterNumber)}</span>
                <span class="mono-label">${escapeHtml(ch.period)}</span>
              </div>
              <span class="chapter-era-tag">${escapeHtml(ch.era)}</span>
            </header>

            <h3 class="chapter-card__title">${escapeHtml(ch.title)}</h3>

            <div class="chapter-card__role">
              <strong>${escapeHtml(ch.roleOrMilestone)}</strong>
              <span aria-hidden="true">·</span>
              <span>${escapeHtml(ch.location)}</span>
            </div>

            <p class="chapter-card__summary">${escapeHtml(ch.summary)}</p>
            <p class="chapter-card__story">${escapeHtml(ch.story)}</p>

            ${
              ch.turningPoint
                ? `
              <div class="turning-point">
                <span class="turning-point__label">The Turning Point</span>
                <p>${escapeHtml(ch.turningPoint)}</p>
              </div>
            `
                : ""
            }

            ${
              ch.lessonForStudents
                ? `
              <div class="lesson-drawer ${isOpen ? "is-open" : ""}">
                <button
                  type="button"
                  class="lesson-drawer__toggle"
                  aria-expanded="${isOpen ? "true" : "false"}"
                >
                  <span class="lesson-drawer__toggle-left">
                    <span class="lesson-drawer__dot" aria-hidden="true"></span>
                    <span>Takeaway for You</span>
                  </span>
                  <svg class="lesson-drawer__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div class="lesson-drawer__content">
                  ${escapeHtml(ch.lessonForStudents)}
                </div>
              </div>
            `
                : ""
            }

            ${
              ch.marginNote
                ? `
              <p class="margin-note">
                <span class="margin-note__mark">SLIDE</span>
                <span>${escapeHtml(ch.marginNote)}</span>
              </p>
            `
                : ""
            }

            <div class="chapter-tags">${tagsHtml}</div>
          </article>
        `;
      })
      .join("");

    // Bind expandable takeaway drawers
    timelineEl.querySelectorAll(".lesson-drawer__toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const drawer = btn.closest(".lesson-drawer");
        const nowOpen = drawer.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(nowOpen));
      });
    });

    setupRevealObserver();
    setupChapterScrollSpy();
  }

  /* ==========================================================================
     3. SCROLL OBSERVERS (REVEAL + STICKY RAIL SPY + PROGRESS BAR)
     ========================================================================== */
  function setupRevealObserver() {
    const elements = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function setupChapterScrollSpy() {
    if (chapterObserver) chapterObserver.disconnect();
    const cards = document.querySelectorAll(".chapter-card");
    if (!cards.length || !("IntersectionObserver" in window)) return;

    chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            cards.forEach((c) => c.classList.toggle("is-current", c.id === id));
            document.querySelectorAll(".rail-item").forEach((r) => {
              r.classList.toggle("is-active", r.dataset.target === id);
            });
          }
        });
      },
      { rootMargin: "-30% 0px -52% 0px", threshold: 0 }
    );

    cards.forEach((card) => chapterObserver.observe(card));
  }

  function setupReadingProgress() {
    const bar = $("reading-progress-bar");
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ==========================================================================
     4. EXPAND / COLLAPSE ALL TAKEAWAYS
     ========================================================================== */
  function setupExpandAllToggle() {
    const btn = $("toggle-all-lessons-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      allLessonsExpanded = !allLessonsExpanded;
      btn.textContent = allLessonsExpanded
        ? "Collapse student takeaways"
        : "Expand all student takeaways";

      document.querySelectorAll(".lesson-drawer").forEach((drawer) => {
        drawer.classList.toggle("is-open", allLessonsExpanded);
        const toggle = drawer.querySelector(".lesson-drawer__toggle");
        if (toggle) toggle.setAttribute("aria-expanded", String(allLessonsExpanded));
      });
    });
  }

  /* ==========================================================================
     5. GRAPHIC DESIGN PORTFOLIO PDF VIEWER (CONTINUOUS VERTICAL SCROLL VIA PDF.JS)
     ========================================================================== */
  function setupPortfolioPdfModal() {
    const modal = $("portfolio-pdf-modal");
    const openBtn = $("open-portfolio-pdf-btn");
    const mobileOpenBtn = $("mobile-open-portfolio-pdf-btn");
    const closeBtn = $("close-portfolio-pdf-btn");
    const viewport = $("pdf-canvas-viewport");
    const scrollTrack = $("pdf-scroll-track");
    const loadingState = $("pdf-loading-state");
    const progressBar = $("pdf-progress-bar");
    const loadingText = $("pdf-loading-text");
    const prevBtn = $("pdf-prev-page");
    const nextBtn = $("pdf-next-page");
    const curPageEl = $("pdf-current-page");
    const totalPagesEl = $("pdf-total-pages");
    const zoomInBtn = $("pdf-zoom-in");
    const zoomOutBtn = $("pdf-zoom-out");
    const zoomFitBtn = $("pdf-zoom-fit");
    const thumbsTrack = $("pdf-thumbs-track");

    if (!modal) return;

    let pdfDoc = null;
    let currentPage = 1;
    let zoomLevelIndex = 2; // Default 1040px
    const zoomWidths = [680, 840, 1040, 1240, 1480];
    const renderedPages = new Set();
    const renderingPages = new Set();
    let isDocBuilt = false;

    // Configure PDF.js worker
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/vendor/pdf.worker.min.js";
    }

    async function loadPdfDocument() {
      if (pdfDoc) return;

      if (!window.pdfjsLib) {
        if (loadingText) loadingText.textContent = "Loading viewer engine...";
        return;
      }

      if (loadingState) loadingState.hidden = false;
      if (loadingText) loadingText.textContent = "Loading Graphic Design Portfolio...";
      if (progressBar) progressBar.style.width = "15%";

      try {
        const loadingTask = window.pdfjsLib.getDocument({
          url: "portfolio.pdf",
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        loadingTask.onProgress = function (progress) {
          if (progress.total > 0 && progressBar) {
            const percent = Math.min(100, Math.round((progress.loaded / progress.total) * 100));
            progressBar.style.width = percent + "%";
            if (loadingText) loadingText.textContent = `Loading Portfolio... ${percent}%`;
          }
        };

        pdfDoc = await loadingTask.promise;

        if (totalPagesEl) totalPagesEl.textContent = pdfDoc.numPages;
        if (loadingState) loadingState.hidden = true;

        buildScrollablePages(pdfDoc.numPages);
        buildThumbnails(pdfDoc.numPages);

        // Render page 1 and 2 immediately
        renderPage(1);
        if (pdfDoc.numPages >= 2) renderPage(2);
      } catch (err) {
        console.error("PDF load error:", err);
        if (loadingText) {
          loadingText.innerHTML = `
            <div style="color: #f87171; margin-bottom: 0.75rem;">Unable to display inline canvas preview.</div>
            <a href="portfolio.pdf" target="_blank" class="btn-primary" style="display: inline-flex;">Open Graphic Design Portfolio PDF</a>
          `;
        }
      }
    }

    function buildScrollablePages(total) {
      if (!scrollTrack || isDocBuilt) return;
      scrollTrack.innerHTML = "";

      for (let i = 1; i <= total; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = `pdf-page-wrapper ${i === 1 ? "is-in-view" : ""}`;
        wrapper.id = `pdf-page-wrapper-${i}`;
        wrapper.dataset.pageNum = String(i);

        const meta = document.createElement("div");
        meta.className = "pdf-page-meta";
        meta.innerHTML = `
          <span>PAGE ${String(i).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
          <span>PRASHANT KUMAR · GRAPHIC DESIGN PORTFOLIO</span>
        `;

        const canvas = document.createElement("canvas");
        canvas.className = "pdf-page-canvas";
        canvas.id = `pdf-page-canvas-${i}`;
        canvas.style.display = "none";

        const placeholder = document.createElement("div");
        placeholder.className = "pdf-page-placeholder";
        placeholder.id = `pdf-placeholder-${i}`;
        placeholder.innerHTML = `<span>Loading Page ${i}...</span>`;

        wrapper.appendChild(meta);
        wrapper.appendChild(canvas);
        wrapper.appendChild(placeholder);
        scrollTrack.appendChild(wrapper);
      }

      isDocBuilt = true;
      setupScrollObservers();
    }

    async function renderPage(num) {
      if (!pdfDoc || renderedPages.has(num) || renderingPages.has(num)) return;
      renderingPages.add(num);

      const canvas = $(`pdf-page-canvas-${num}`);
      const placeholder = $(`pdf-placeholder-${num}`);
      if (!canvas) {
        renderingPages.delete(num);
        return;
      }

      try {
        const page = await pdfDoc.getPage(num);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Base viewport on standard 1024.5 x 576 canvas resolution
        const baseScale = 1.35;
        const viewportObj = page.getViewport({ scale: baseScale * dpr });

        canvas.width = Math.floor(viewportObj.width);
        canvas.height = Math.floor(viewportObj.height);

        const ctx = canvas.getContext("2d");
        await page.render({
          canvasContext: ctx,
          viewport: viewportObj,
        }).promise;

        renderedPages.add(num);
        if (placeholder) placeholder.style.display = "none";
        canvas.style.display = "block";
      } catch (err) {
        console.error(`Page ${num} render error:`, err);
      } finally {
        renderingPages.delete(num);
      }
    }

    function setupScrollObservers() {
      if (!("IntersectionObserver" in window)) {
        // Fallback: render all pages progressively
        let p = 1;
        function renderNext() {
          if (p <= pdfDoc.numPages) {
            renderPage(p).then(() => {
              p++;
              setTimeout(renderNext, 80);
            });
          }
        }
        renderNext();
        return;
      }

      // Preload observer: renders pages before they enter viewport
      const preloadObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const num = parseInt(entry.target.dataset.pageNum, 10);
              renderPage(num);
              if (num + 1 <= pdfDoc.numPages) renderPage(num + 1);
              if (num - 1 >= 1) renderPage(num - 1);
            }
          });
        },
        {
          root: viewport,
          rootMargin: "650px 0px 650px 0px",
        }
      );

      // Active view observer: detects current visible page
      const activeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const num = parseInt(entry.target.dataset.pageNum, 10);
              currentPage = num;

              if (curPageEl) curPageEl.textContent = num;
              if (prevBtn) prevBtn.disabled = num <= 1;
              if (nextBtn) nextBtn.disabled = num >= pdfDoc.numPages;

              updateActiveThumb(num);

              document.querySelectorAll(".pdf-page-wrapper").forEach((w) => {
                w.classList.toggle("is-in-view", w === entry.target);
              });
            }
          });
        },
        {
          root: viewport,
          threshold: 0.35,
        }
      );

      document.querySelectorAll(".pdf-page-wrapper").forEach((el) => {
        preloadObserver.observe(el);
        activeObserver.observe(el);
      });
    }

    function scrollToPage(num) {
      if (!pdfDoc) return;
      const targetNum = Math.max(1, Math.min(pdfDoc.numPages, num));
      const target = $(`pdf-page-wrapper-${targetNum}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        renderPage(targetNum);
      }
    }

    function buildThumbnails(total) {
      if (!thumbsTrack) return;
      thumbsTrack.innerHTML = "";
      for (let i = 1; i <= total; i++) {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = `pdf-thumb-pill ${i === currentPage ? "is-active" : ""}`;
        thumb.textContent = `P${i}`;
        thumb.title = `Scroll to Page ${i}`;
        thumb.addEventListener("click", () => {
          scrollToPage(i);
        });
        thumbsTrack.appendChild(thumb);
      }
    }

    function updateActiveThumb(num) {
      if (!thumbsTrack) return;
      const pills = thumbsTrack.querySelectorAll(".pdf-thumb-pill");
      pills.forEach((p, idx) => {
        const active = idx + 1 === num;
        p.classList.toggle("is-active", active);
        if (active) {
          p.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });
    }

    function applyZoom() {
      if (!scrollTrack) return;
      const targetWidth = zoomWidths[zoomLevelIndex];
      scrollTrack.style.maxWidth = `${targetWidth}px`;
    }

    function openPdf() {
      const drawer = $("mobile-nav-drawer");
      if (drawer && !drawer.hidden) {
        drawer.hidden = true;
        $("hamburger-btn")?.setAttribute("aria-expanded", "false");
      }

      modal.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn?.focus();

      loadPdfDocument();
    }

    function closePdf() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    openBtn?.addEventListener("click", openPdf);
    mobileOpenBtn?.addEventListener("click", openPdf);
    closeBtn?.addEventListener("click", closePdf);

    prevBtn?.addEventListener("click", () => {
      scrollToPage(currentPage - 1);
    });

    nextBtn?.addEventListener("click", () => {
      scrollToPage(currentPage + 1);
    });

    zoomInBtn?.addEventListener("click", () => {
      if (zoomLevelIndex < zoomWidths.length - 1) {
        zoomLevelIndex++;
        applyZoom();
      }
    });

    zoomOutBtn?.addEventListener("click", () => {
      if (zoomLevelIndex > 0) {
        zoomLevelIndex--;
        applyZoom();
      }
    });

    zoomFitBtn?.addEventListener("click", () => {
      zoomLevelIndex = 2; // Default 1040px fit
      applyZoom();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePdf();
    });

    window.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") closePdf();
      else if (e.key === "PageUp") {
        e.preventDefault();
        scrollToPage(currentPage - 1);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        scrollToPage(currentPage + 1);
      }
    });
  }

  /* ==========================================================================
     6. MOBILE NAVIGATION DRAWER (3-Line Hamburger Menu)
     ========================================================================== */
  function setupMobileNavDrawer() {
    const hamburgerBtn = $("hamburger-btn");
    const drawer = $("mobile-nav-drawer");
    const closeBtn = $("mobile-nav-close");
    const backdrop = $("mobile-nav-backdrop");
    const navLinks = document.querySelectorAll(".mobile-nav-link");

    if (!hamburgerBtn || !drawer) return;

    function openDrawer() {
      drawer.hidden = false;
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.hidden = true;
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    hamburgerBtn.addEventListener("click", () => {
      if (drawer.hidden) {
        openDrawer();
      } else {
        closeDrawer();
      }
    });

    closeBtn?.addEventListener("click", closeDrawer);
    backdrop?.addEventListener("click", closeDrawer);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeDrawer();
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !drawer.hidden) {
        closeDrawer();
      }
    });
  }

  /* ==========================================================================
     INIT
     ========================================================================== */
  hydrateContent();
  renderEraFilters();
  renderTimeline();
  setupReadingProgress();
  setupExpandAllToggle();
  setupPortfolioPdfModal();
  setupMobileNavDrawer();
})();
