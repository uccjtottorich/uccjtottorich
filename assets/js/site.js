document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("has-js");

  const year = document.querySelector("[data-current-year]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const filterPanel = document.querySelector("[data-gathering-filter]");
  const revealTargets = document.querySelectorAll(".home-banner, .image-frame");
  const sermonCurrent = document.querySelector("[data-sermon-current]");
  const sermonBoard = document.querySelector("[data-sermon-board]");
  const language = document.documentElement.lang === "ko" ? "ko" : "ja";
  const menuLabels = {
    ja: { open: "メニューを開く", close: "メニューを閉じる" },
    ko: { open: "메뉴 열기", close: "메뉴 닫기" }
  };

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderSermons() {
    if (!window.TOTTORI_SERMONS) {
      return;
    }

    const sermons = window.TOTTORI_SERMONS[language] || [];
    if (!sermons.length) {
      return;
    }

    const current = sermons[0];
    if (sermonCurrent) {
      const date = sermonCurrent.querySelector("[data-sermon-date]");
      const preacher = sermonCurrent.querySelector("[data-sermon-preacher]");
      const title = sermonCurrent.querySelector("[data-sermon-title]");
      const scripture = sermonCurrent.querySelector("[data-sermon-scripture]");
      const body = sermonCurrent.querySelector("[data-sermon-body]");

      if (date) date.textContent = `${current.displayDate} ${current.service || ""}`.trim();
      if (preacher) preacher.textContent = language === "ko" ? `설교자: ${current.preacher || ""}` : `説教者：${current.preacher || ""}`;
      if (title) title.textContent = current.title || "";
      if (scripture) scripture.textContent = current.scripture || "";
      if (body) {
        body.innerHTML = (current.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
      }
    }

    if (sermonBoard) {
      const labels = {
        ja: { open: "全文を読む", close: "閉じる" },
        ko: { open: "전문 읽기", close: "닫기" }
      };

      sermonBoard.innerHTML = sermons.map((sermon, index) => `
        <article class="sermon-card">
          <button class="sermon-card-toggle" type="button" aria-expanded="false" aria-controls="sermon-detail-${index}">
            <span class="sermon-card-main">
              <time datetime="${escapeHtml(sermon.date)}">${escapeHtml(sermon.displayDate)}</time>
              <span class="sermon-card-title">${escapeHtml(sermon.title)}</span>
              <span class="sermon-scripture">${escapeHtml(sermon.scripture)}</span>
              <span class="sermon-card-summary">${escapeHtml(sermon.summary || (sermon.body || [])[0] || "")}</span>
            </span>
            <span class="sermon-card-action">${labels[language].open}</span>
          </button>
          <div class="sermon-card-detail" id="sermon-detail-${index}" hidden>
            ${(sermon.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
        </article>
      `).join("");

      sermonBoard.querySelectorAll(".sermon-card-toggle").forEach((button) => {
        button.addEventListener("click", () => {
          const detail = document.getElementById(button.getAttribute("aria-controls"));
          const isOpen = button.getAttribute("aria-expanded") === "true";

          button.setAttribute("aria-expanded", String(!isOpen));
          button.querySelector(".sermon-card-action").textContent = isOpen ? labels[language].open : labels[language].close;

          if (detail) {
            detail.hidden = isOpen;
          }
        });
      });
    }
  }

  renderSermons();

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
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? menuLabels[language].open : menuLabels[language].close);
      mobileNav.classList.toggle("open", !isOpen);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", menuLabels[language].open);
        mobileNav.classList.remove("open");
      });
    });
  }

  if (filterPanel) {
    const descriptionsByLanguage = {
      ja: {
        first_time: "キリスト教会や主日の礼拝への出席が初めての方には、毎週日曜日の「主日礼拝」が最もおすすめです。予約不要・どなたでも自由にご参加いただけます。月1回、礼拝後に「コーヒータイム」も設けております。",
        bible_study: "聖書の豊かなみことばをじっくりと学び、共に分かち合い、静かに祈りを捧げる平日の「聖書研究・祈祷会」や「聖書に親しむ会」をお勧めします。",
        family_kids: "乳幼児から小学生、中高生など若い世代のために、毎週日曜日朝に「教会学校（CS）」をひらき、年齢に応じたお話や讃美歌を楽しんでいます。",
        music_choir: "荘厳な讃美歌の響きや聖歌隊のコーラスを愛する方は、日曜の「主日礼拝」での合唱や、礼拝後に行われる聖歌隊の「讃美練習」へのご参加がぴったりです。",
        weekday: "平日の落ち着いた時間帯に集まりたいご婦人の方向けに、親睦と学びを兼ねた女性の会「紫苑会」や、毎週木曜日の「聖書研究会」がございます。",
        fellowship: "年代や歩みに応じた交わりの集いです。シオン会、青年会、壮年会をご案内します。"
      },
      ko: {
        first_time: "기독교회나 주일예배 참석이 처음이신 분께는 매주 주일의 “주일예배”를 가장 추천합니다. 예약 없이 누구나 자유롭게 참여하실 수 있으며, 월 1회 예배 후 커피 타임도 있습니다.",
        bible_study: "성경 말씀을 깊이 배우고 함께 나누며 조용히 기도하고 싶은 분께는 평일의 “성경연구・기도회”와 “성경과 친해지는 모임”을 추천합니다.",
        family_kids: "영유아부터 초등학생, 중고등학생까지 젊은 세대를 위해 매주 주일 아침 교회학교(CS)를 열고 있습니다.",
        music_choir: "찬송가의 울림과 성가대의 합창을 사랑하시는 분께는 주일예배와 예배 후 성가대 연습이 잘 맞습니다.",
        weekday: "평일의 차분한 시간에 모이고 싶은 분께는 시온회와 매주 목요일의 성경연구・기도회를 안내합니다.",
        fellowship: "연령과 삶의 걸음에 따른 교제 모임입니다. 시온회, 청년회, 장년회를 안내합니다."
      }
    };
    const descriptions = descriptionsByLanguage[language];

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
});
