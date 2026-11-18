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
  let stageMode = false;
  let stageStops = [];
  let stageIndex = 0;
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
    setText("masthead-name", data.speaker.name);
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

    // Editorial letter
    setText("letter-lead", `“${data.speaker.letterLead}”`);
    setText("letter-sig-name", `— ${data.speaker.firstName || data.speaker.name}`);
    setText("letter-sig-meta", `${data.event.alumniBadge}`.toUpperCase());

    const letterBodyEl = $("letter-body");
    if (letterBodyEl && Array.isArray(data.speaker.letterBody)) {
      letterBodyEl.innerHTML = data.speaker.letterBody
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");
    }

    const featureImg = $("feature-image");
    if (featureImg && data.speaker.featureImage) {
      featureImg.src = data.speaker.featureImage;
    }
    setText("feature-image-caption", data.speaker.featureImageCaption);

    // Notes to students
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

      const emailBtn = $("connect-email-btn");
      if (emailBtn && data.connect.email) {
        const subject = encodeURIComponent(
          `Hello from ${data.event.collegeShort || "campus"} talk!`
        );
        emailBtn.href = `mailto:${data.connect.email}?subject=${subject}`;
      }

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
    setText("footer-event-name", data.event.eventName);
    setText(
      "footer-college-short",
      (data.event.collegeShort || data.event.collegeName).toUpperCase()
    );
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

    // Render sticky chapter index rail
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

    // Render timeline chapter cards
    timelineEl.innerHTML = chapters
      .map((ch, idx) => {
        const isOpen = allLessonsExpanded || stageMode || idx === 0;
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
                <span class="margin-note__mark">NOTE</span>
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

    // Bind expandable lesson drawers
    timelineEl.querySelectorAll(".lesson-drawer__toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const drawer = btn.closest(".lesson-drawer");
        const nowOpen = drawer.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(nowOpen));
      });
    });

    setupRevealObserver();
    setupChapterScrollSpy();
    buildStageStops();
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
     5. STAGE MODE (PROJECTOR WALKTHROUGH WITH KEYBOARD NAVIGATION)
     ========================================================================== */
  function buildStageStops() {
    stageStops = [
      { id: "top", label: "Cover" },
      { id: "story", label: "The Letter" },
      ...Array.from(document.querySelectorAll(".chapter-card")).map((card) => {
        const ch = data.timeline.find((item) => item.id === card.id);
        return {
          id: card.id,
          label: ch ? `Chapter ${ch.chapterNumber}` : card.id,
        };
      }),
      { id: "notes", label: "Notes" },
      { id: "connect", label: "Connect & Q&A" },
    ];
    updateStageHud();
  }

  function setStageMode(enabled) {
    stageMode = enabled;
    document.body.classList.toggle("stage-mode", enabled);

    const btn = $("stage-mode-btn");
    if (btn) btn.setAttribute("aria-pressed", String(enabled));

    const hud = $("stage-hud");
    if (hud) hud.hidden = !enabled;

    if (enabled) {
      // Open all student takeaways automatically so they're readable on a projector
      document.querySelectorAll(".lesson-drawer").forEach((drawer) => {
        drawer.classList.add("is-open");
        const toggle = drawer.querySelector(".lesson-drawer__toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "true");
      });
      buildStageStops();
    }
  }

  function goToStageStop(index) {
    if (!stageStops.length) return;
    stageIndex = Math.max(0, Math.min(stageStops.length - 1, index));
    const stop = stageStops[stageIndex];
    const target = document.getElementById(stop.id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    updateStageHud();
  }

  function updateStageHud() {
    const labelEl = $("stage-current-label");
    const prevBtn = $("stage-prev-btn");
    const nextBtn = $("stage-next-btn");
    if (!stageStops.length) return;

    const current = stageStops[stageIndex] || stageStops[0];
    if (labelEl) {
      labelEl.textContent = `${current.label} (${stageIndex + 1}/${stageStops.length})`;
    }
    if (prevBtn) prevBtn.disabled = stageIndex <= 0;
    if (nextBtn) nextBtn.disabled = stageIndex >= stageStops.length - 1;
  }

  function setupStageMode() {
    const toggleBtn = $("stage-mode-btn");
    const railTrigger = $("rail-stage-trigger");
    const exitBtn = $("stage-exit-btn");
    const prevBtn = $("stage-prev-btn");
    const nextBtn = $("stage-next-btn");

    toggleBtn?.addEventListener("click", () => setStageMode(!stageMode));
    railTrigger?.addEventListener("click", () => {
      setStageMode(true);
      goToStageStop(2); // Jump straight to Chapter 01
    });
    exitBtn?.addEventListener("click", () => setStageMode(false));
    prevBtn?.addEventListener("click", () => goToStageStop(stageIndex - 1));
    nextBtn?.addEventListener("click", () => goToStageStop(stageIndex + 1));

    window.addEventListener("keydown", (e) => {
      if (!stageMode) return;
      if (e.key === "Escape") {
        setStageMode(false);
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goToStageStop(stageIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToStageStop(stageIndex - 1);
      }
    });
  }

  /* ==========================================================================
     6. AUDIENCE QR & SHARE MODAL
     ========================================================================== */
  function setupQrModal() {
    const modal = $("qr-modal");
    const openBtn = $("open-qr-btn");
    const connectQrBtn = $("connect-qr-btn");
    const closeBtn = $("close-qr-btn");
    const qrImg = $("qr-image");
    const qrFallback = $("qr-fallback");
    const urlInput = $("share-url-input");
    const copyBtn = $("copy-url-btn");

    if (!modal) return;

    function resolveShareUrl() {
      const configured = (data.connect && data.connect.shareUrl || "").trim();
      if (configured) return configured;
      return window.location.href;
    }

    function openModal() {
      const url = resolveShareUrl();
      if (urlInput) urlInput.value = url;

      const customQr = (data.connect && data.connect.customQrImage || "").trim();
      const isLocalFile = url.startsWith("file://");

      if (customQr) {
        qrImg.src = customQr;
        qrImg.hidden = false;
        qrFallback.hidden = true;
      } else if (isLocalFile) {
        qrImg.hidden = true;
        qrFallback.hidden = false;
      } else {
        qrImg.hidden = false;
        qrFallback.hidden = true;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=6&color=1c1917&bgcolor=ffffff&data=${encodeURIComponent(
          url
        )}`;
        qrImg.onerror = () => {
          qrImg.hidden = true;
          qrFallback.hidden = false;
        };
      }

      modal.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn?.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    openBtn?.addEventListener("click", openModal);
    connectQrBtn?.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    copyBtn?.addEventListener("click", async () => {
      const text = urlInput?.value || "";
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
      } catch {
        urlInput?.select();
        document.execCommand("copy");
        copyBtn.textContent = "Copied!";
      }
      setTimeout(() => {
        copyBtn.textContent = "Copy Link";
      }, 1800);
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
  setupStageMode();
  setupQrModal();
})();
