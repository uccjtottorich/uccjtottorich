document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("has-js");

  const year = document.querySelector("[data-current-year]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const desktopDropdowns = document.querySelectorAll("[data-nav-dropdown]");
  const mobileNavGroups = document.querySelectorAll("[data-mobile-nav-group]");
  const filterPanel = document.querySelector("[data-gathering-filter]");
  const revealTargets = document.querySelectorAll(".home-banner, .image-frame, .gathering-detail-image");
  const homeGallery = document.querySelector("[data-home-gallery]");
  const scriptureRotation = document.querySelector("[data-scripture-rotation]");
  const specialEventModal = document.querySelector("[data-special-event-modal]");
  const isCmsSermonPage = document.body.classList.contains("cms-sermon-page");
  const sermonBoard = isCmsSermonPage ? document.querySelector(".sermon-board") : null;
  const menuLabelSets = {
    ja: { open: "メニューを開く", close: "メニューを閉じる" },
    ko: { open: "메뉴 열기", close: "메뉴 닫기" },
    en: { open: "Open menu", close: "Close menu" }
  };
  const menuLabels = menuLabelSets[document.documentElement.lang] || menuLabelSets.ja;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  if (specialEventModal) {
    const storageKey = "tottori-special-event-20261024-hide-until";
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
    const eventEnd = new Date("2026-10-25T23:59:59+09:00");
    const closeButtons = specialEventModal.querySelectorAll("[data-special-event-close]");
    const todayCheckbox = specialEventModal.querySelector("[data-special-event-today]");
    const dialog = specialEventModal.querySelector(".special-event-dialog");
    const focusableSelector = "button, input, a[href]";
    let lastFocusedElement = null;

    let isHiddenToday = false;
    try {
      isHiddenToday = window.localStorage.getItem(storageKey) === today;
    } catch (error) {
      isHiddenToday = false;
    }

    const closeSpecialEvent = () => {
      if (todayCheckbox?.checked) {
        try {
          window.localStorage.setItem(storageKey, today);
        } catch (error) {
          // The notice can still be closed when storage is unavailable.
        }
      }

      specialEventModal.hidden = true;
      document.body.classList.remove("special-event-open");
      lastFocusedElement?.focus?.();
    };

    todayCheckbox?.addEventListener("change", () => {
      if (todayCheckbox.checked) {
        closeSpecialEvent();
      }
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeSpecialEvent);
    });

    specialEventModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSpecialEvent();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusable = Array.from(dialog.querySelectorAll(focusableSelector));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });

    if (!isHiddenToday && new Date() <= eventEnd) {
      window.setTimeout(() => {
        lastFocusedElement = document.activeElement;
        specialEventModal.hidden = false;
        document.body.classList.add("special-event-open");
        specialEventModal.querySelector(".special-event-close")?.focus();
      }, 450);
    }
  }

  desktopDropdowns.forEach((button) => {
    const dropdown = button.closest(".nav-dropdown");

    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      desktopDropdowns.forEach((otherButton) => {
        otherButton.setAttribute("aria-expanded", "false");
        otherButton.closest(".nav-dropdown")?.classList.remove("is-open");
      });
      button.setAttribute("aria-expanded", String(willOpen));
      dropdown?.classList.toggle("is-open", willOpen);
    });
  });

  mobileNavGroups.forEach((button) => {
    const group = button.closest(".mobile-nav-group");

    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willOpen));
      group?.classList.toggle("is-open", willOpen);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-dropdown")) return;
    desktopDropdowns.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.closest(".nav-dropdown")?.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    desktopDropdowns.forEach((button) => {
      if (button.getAttribute("aria-expanded") === "true") {
        button.setAttribute("aria-expanded", "false");
        button.closest(".nav-dropdown")?.classList.remove("is-open");
        button.focus();
      }
    });
  });

  function enhanceCmsSermons() {
    if (!isCmsSermonPage || !sermonBoard) {
      return;
    }

    sermonBoard.querySelectorAll(".sermon-card").forEach((card, index) => {
      const summary = card.querySelector(".sermon-card-summary");

      if (!summary) {
        return;
      }

      card.classList.add("cms-sermon-card");
      // The generator deliberately outputs the summary only.  Keep the
      // progressive-enhancement control owned by this script and remove a
      // stale control before (re-)initialising a card.
      card.querySelectorAll(".cms-sermon-summary-toggle").forEach((toggle) => {
        toggle.remove();
      });
      summary.classList.add("cms-sermon-summary", "is-collapsed");
      summary.id = `cms-sermon-summary-${index + 1}`;

      if (summary.scrollHeight <= summary.clientHeight + 1) {
        summary.classList.remove("is-collapsed");
        return;
      }

      const button = document.createElement("button");
      button.className = "cms-sermon-summary-toggle";
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", summary.id);
      button.textContent = "続きを読む";
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!expanded));
        button.textContent = expanded ? "続きを読む" : "閉じる";
        summary.classList.toggle("is-collapsed", expanded);
      });
      card.append(button);
    });
  }

  enhanceCmsSermons();

  if (scriptureRotation) {
    const verses = Array.from(scriptureRotation.querySelectorAll("blockquote"));

    if (verses.length > 1) {
      const storageKey = `tottori-scripture-last-${document.documentElement.lang || "ja"}`;
      let previousIndex = -1;

      try {
        previousIndex = Number.parseInt(window.sessionStorage.getItem(storageKey), 10);
      } catch (error) {
        previousIndex = -1;
      }

      const availableIndexes = verses
        .map((verse, index) => index)
        .filter((index) => index !== previousIndex);
      const selectedIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

      verses.forEach((verse, index) => {
        const isSelected = index === selectedIndex;
        verse.hidden = !isSelected;
        verse.classList.toggle("is-active", isSelected);
      });

      try {
        window.sessionStorage.setItem(storageKey, String(selectedIndex));
      } catch (error) {
        // The verse still rotates when browser storage is unavailable.
      }
    }
  }

  if (homeGallery) {
    const slides = Array.from(homeGallery.querySelectorAll(".home-banner-slide"));
    let activeSlide = slides.findIndex((slide) => slide.classList.contains("is-active"));

    if (activeSlide < 0) {
      activeSlide = 0;
    }

    const galleryLabelSets = {
      ja: {
        prev: "前の写真",
        next: "次の写真",
        dots: "スライド選択",
        dot: (index) => `${index}枚目の写真へ移動`
      },
      ko: {
        prev: "이전 사진",
        next: "다음 사진",
        dots: "슬라이드 선택",
        dot: (index) => `${index}번째 사진으로 이동`
      },
      en: {
        prev: "Previous photo",
        next: "Next photo",
        dots: "Slide navigation",
        dot: (index) => `Go to photo ${index}`
      }
    };
    const galleryLabels = galleryLabelSets[document.documentElement.lang] || galleryLabelSets.ja;

    function preloadSlide(index) {
      const normalizedIndex = ((index % slides.length) + slides.length) % slides.length;
      const img = slides[normalizedIndex]?.querySelector("img");
      if (img && img.loading === "lazy") {
        img.loading = "eager";
      }
    }

    function prepareSlidePositions(current, next, direction = 1) {
      preloadSlide(next);
      preloadSlide(next + direction);

      homeGallery.classList.add("is-preparing-slide");

      slides.forEach((slide, index) => {
        slide.classList.remove("is-active", "is-before", "is-after");

        if (index === current) {
          slide.classList.add("is-active");
        } else if (index === next) {
          slide.classList.add(direction >= 0 ? "is-after" : "is-before");
        } else {
          slide.classList.add(index < current ? "is-before" : "is-after");
        }
      });

      void homeGallery.offsetWidth;
      homeGallery.classList.remove("is-preparing-slide");
    }

    prepareSlidePositions(activeSlide, (activeSlide + 1) % slides.length, 1);

    if (slides.length > 1) {
      let autoPlayTimer = null;
      const dotButtons = [];

      const prevButton = document.createElement("button");
      prevButton.type = "button";
      prevButton.className = "home-banner-nav home-banner-nav--prev";
      prevButton.setAttribute("aria-label", galleryLabels.prev);
      prevButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>`;

      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.className = "home-banner-nav home-banner-nav--next";
      nextButton.setAttribute("aria-label", galleryLabels.next);
      nextButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

      const dotsContainer = document.createElement("div");
      dotsContainer.className = "home-banner-dots";
      dotsContainer.setAttribute("role", "group");
      dotsContainer.setAttribute("aria-label", galleryLabels.dots);

      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "home-banner-dot";
        dot.setAttribute("aria-label", galleryLabels.dot(index + 1));
        dot.setAttribute("aria-current", index === activeSlide ? "true" : "false");
        dot.classList.toggle("is-active", index === activeSlide);
        dot.addEventListener("click", () => {
          if (index === activeSlide) return;
          const direction = index > activeSlide ? 1 : -1;
          goToSlide(index, direction, true);
        });
        dotButtons.push(dot);
        dotsContainer.append(dot);
      });

      homeGallery.append(prevButton, nextButton, dotsContainer);

      function updateDots() {
        dotButtons.forEach((dot, index) => {
          const isCurrent = index === activeSlide;
          dot.classList.toggle("is-active", isCurrent);
          dot.setAttribute("aria-current", isCurrent ? "true" : "false");
        });
      }

      function goToSlide(targetIndex, direction = 1, resetTimer = false) {
        const nextSlide = ((targetIndex % slides.length) + slides.length) % slides.length;
        if (nextSlide === activeSlide) return;

        const currentSlide = activeSlide;
        prepareSlidePositions(currentSlide, nextSlide, direction);

        slides[currentSlide].classList.remove("is-active");
        slides[currentSlide].classList.add(direction >= 0 ? "is-before" : "is-after");
        slides[nextSlide].classList.remove("is-before", "is-after");
        slides[nextSlide].classList.add("is-active");

        activeSlide = nextSlide;
        updateDots();
        preloadSlide(activeSlide + direction);

        if (resetTimer) {
          restartAutoPlay();
        }
      }

      function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = window.setInterval(() => {
          goToSlide(activeSlide + 1, 1, false);
        }, 6500);
      }

      function stopAutoPlay() {
        if (autoPlayTimer !== null) {
          window.clearInterval(autoPlayTimer);
          autoPlayTimer = null;
        }
      }

      function restartAutoPlay() {
        startAutoPlay();
      }

      prevButton.addEventListener("click", () => {
        goToSlide(activeSlide - 1, -1, true);
      });

      nextButton.addEventListener("click", () => {
        goToSlide(activeSlide + 1, 1, true);
      });

      let touchStartX = 0;
      let touchStartY = 0;
      let isSwiping = false;

      homeGallery.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isSwiping = true;
      }, { passive: true });

      homeGallery.addEventListener("touchend", (event) => {
        if (!isSwiping || event.changedTouches.length !== 1) return;
        isSwiping = false;

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
          if (deltaX < 0) {
            goToSlide(activeSlide + 1, 1, true);
          } else {
            goToSlide(activeSlide - 1, -1, true);
          }
        }
      }, { passive: true });

      startAutoPlay();
    }
  }

  if (revealTargets.length) {
    revealTargets.forEach((target) => {
      target.classList.add("image-reveal");
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.18 });

      revealTargets.forEach((target) => revealObserver.observe(target));
    } else {
      revealTargets.forEach((target) => {
        target.classList.add("is-visible");
      });
    }
  }

  if (menuButton && mobileNav) {
    const desktopBreakpoint = 921;
    let mobileMenuOpenedAt = 0;
    const closeMobileMenu = () => {
      mobileMenuOpenedAt = 0;
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", menuLabels.open);
      mobileNav.classList.remove("open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMobileMenu();
        return;
      }

      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", menuLabels.close);
      mobileNav.classList.add("open");
      mobileMenuOpenedAt = Date.now();
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    const closeMobileMenuOnScrollIntent = () => {
      if (Date.now() - mobileMenuOpenedAt < 300) {
        return;
      }

      if (menuButton.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
      }
    };

    window.addEventListener("touchmove", closeMobileMenuOnScrollIntent, { passive: true });
    window.addEventListener("wheel", closeMobileMenuOnScrollIntent, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
        menuButton.focus();
        return;
      }

      if ([" ", "ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp"].includes(event.key)) {
        closeMobileMenuOnScrollIntent();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= desktopBreakpoint) {
        closeMobileMenu();
      }
    });
  }

  if (filterPanel) {
    const descriptions = {
      first_time: "キリスト教会や主日の礼拝への出席が初めての方には、毎週日曜日の「主日礼拝」が最もおすすめです。予約不要・どなたでも自由にご参加いただけます。月1回、礼拝後に「コーヒータイム」も設けております。",
      bible_study: "聖書の豊かなみことばをじっくりと学び、共に分かち合い、静かに祈りを捧げる平日の「聖書研究・祈祷会」や「聖書に親しむ集い」をお勧めします。",
      family_kids: "乳幼児から小学生、中高生など若い世代のために、毎週日曜日朝に「教会学校（CS）」をひらき、年齢に応じたお話や讃美歌を楽しんでいます。",
      music_choir: "荘厳な讃美歌の響きや聖歌隊のコーラスを愛する方は、日曜の「主日礼拝」での合唱や、礼拝後に行われる聖歌隊の「讃美練習」へのご参加がぴったりです。",
      weekday: "平日の落ち着いた時間帯に集まりたいご婦人の方向けに、親睦と学びを兼ねた女性の会「シオン会」や、毎週木曜日の「聖書研究・祈祷会」がございます。",
      fellowship: "年代や歩みに応じた交わりの集いです。シオン会、青年会、壮年会をご案内します。"
    };

    const buttons = filterPanel.querySelectorAll("[data-filter]");
    const info = filterPanel.querySelector("[data-filter-info]");
    const items = document.querySelectorAll("[data-gathering-item]");

    function applyGatheringFilter(filter) {
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
      });

      if (filter === "all") {
        if (info) {
          info.classList.remove("open");
          info.textContent = "";
        }

        items.forEach((item) => {
          item.classList.remove("is-muted", "is-highlighted");
        });
        return;
      }

      if (info) {
        info.textContent = descriptions[filter] || "";
        info.classList.toggle("open", Boolean(info.textContent));
      }

      items.forEach((item) => {
        const tags = (item.dataset.tags || "").split(/\s+/);
        const isMatch = tags.includes(filter);
        item.classList.toggle("is-highlighted", isMatch);
        item.classList.toggle("is-muted", !isMatch);
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        applyGatheringFilter(button.dataset.filter || "all");
      });
    });
  }

  const facilityLightbox = document.querySelector("[data-facility-lightbox]");
  const facilityCards = document.querySelectorAll(".facility-card--with-image");

  if (facilityLightbox && facilityCards.length) {
    const lightboxImage = facilityLightbox.querySelector("[data-facility-lightbox-image]");
    const lightboxTitle = facilityLightbox.querySelector("[data-facility-lightbox-title]");
    const lightboxDesc = facilityLightbox.querySelector("[data-facility-lightbox-desc]");
    const closeButtons = facilityLightbox.querySelectorAll("[data-facility-lightbox-close]");
    const closeBtn = facilityLightbox.querySelector(".facility-lightbox-close");
    let lastFocusedCardImage = null;

    const closeFacilityLightbox = () => {
      facilityLightbox.hidden = true;
      document.body.classList.remove("facility-lightbox-open");
      if (lightboxImage) {
        lightboxImage.src = "";
        lightboxImage.alt = "";
      }
      lastFocusedCardImage?.focus?.();
    };

    const openFacilityLightbox = (card, triggerElement) => {
      const img = card.querySelector(".facility-card-image img");
      const title = card.querySelector(".facility-card-body h3");
      const desc = card.querySelector(".facility-card-body p");

      if (!img || !lightboxImage) {
        return;
      }

      lastFocusedCardImage = triggerElement || img;
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || "";
      if (lightboxTitle) {
        lightboxTitle.textContent = title ? title.textContent : "";
      }
      if (lightboxDesc) {
        lightboxDesc.textContent = desc ? desc.textContent : "";
      }

      facilityLightbox.hidden = false;
      document.body.classList.add("facility-lightbox-open");
      closeBtn?.focus?.();
    };

    facilityCards.forEach((card) => {
      const img = card.querySelector(".facility-card-image img");
      const title = card.querySelector(".facility-card-body h3");
      if (!img) {
        return;
      }

      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `${title ? title.textContent : "施設写真"}を拡大表示`);

      img.addEventListener("click", () => {
        openFacilityLightbox(card, img);
      });

      img.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFacilityLightbox(card, img);
        }
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeFacilityLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (facilityLightbox.hidden) {
        return;
      }

      if (event.key === "Escape") {
        closeFacilityLightbox();
      } else if (event.key === "Tab" && closeBtn) {
        event.preventDefault();
        closeBtn.focus();
      }
    });
  }
});
