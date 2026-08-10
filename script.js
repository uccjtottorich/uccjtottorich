// 公開リポジトリ用：検索エンジンへのインデックス登録を依頼しない。
const searchBlockMeta = document.createElement('meta');
searchBlockMeta.name = 'robots';
searchBlockMeta.content = 'noindex, nofollow, noarchive, nosnippet';
document.head.append(searchBlockMeta);
const googleSearchBlockMeta = document.createElement('meta');
googleSearchBlockMeta.name = 'googlebot';
googleSearchBlockMeta.content = 'noindex, nofollow, noarchive, nosnippet';
document.head.append(googleSearchBlockMeta);

// ヘッダーとフッターの項目を、現在公開しているページ構成に合わせて統一する。
const menuSections = {
  admission: [
    ['guide.html', '園を知る'],
    ['admissions.html', '見学・入園の流れ'],
    ['greeting.html', '園長あいさつ'],
    ['policy.html', '教育方針'],
    ['class.html', '職員・クラス・保育時間'],
    ['history.html', '沿革'],
    ['apply.html', '募集要項'],
    ['request.html', '資料請求'],
    ['information.html', '情報公開']
  ],
  life: [
    ['life.html', '園の生活と行事'],
    ['schedule.html', '一日の流れ'],
    ['annual.html', '年間行事予定'],
    ['lunch.html', '給食'],
    ['safe.html', '安全・衛生について'],
    ['map.html', '園内探索マップ'],
    ['bus.html', '通園バスコース']
  ],
  nozomikai: [
    ['nozomikai.html', 'のぞみ会活動'],
    ['millefeuille.html', 'ミルフィーユ'],
    ['candy.html', 'キャンディ'],
    ['olive.html', 'オリーブ'],
    ['sorairo.html', 'そらいろのたね'],
    ['tomsawyer.html', 'トムソーヤパパの会'],
    ['nozomikai-library.html', 'のぞみ会図書']
  ],
  utility: [
    ['parent.html', '在園中の保護者の皆様'],
    ['documents.html', '資料・書類'],
    ['access.html', 'アクセス'],
    ['contact.html', 'お問い合わせ']
  ],
  other: [
    ['playroom.html', '子育て支援プレイルーム'],
    ['album.html', 'あいしんモーメント'],
    ['faq.html', 'よくある質問'],
    ['parent.html', '在園中の保護者の皆様'],
    ['documents.html', '資料・書類'],
    ['access.html', 'アクセス'],
    ['contact.html', 'お問い合わせ']
  ]
};

const makeLink = ([href, label], className = '') => {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  if (className) link.className = className;
  return link;
};
const makeDesktopGroup = (parent, items) => {
  const group = document.createElement('div');
  group.className = 'menu-group';
  if (parent[0]) {
    group.append(makeLink(parent, 'menu-parent'));
  } else {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'menu-parent menu-parent-button';
    trigger.textContent = parent[1];
    trigger.setAttribute('aria-haspopup', 'true');
    group.append(trigger);
  }
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  items.forEach((item) => dropdown.append(makeLink(item)));
  group.append(dropdown);
  return group;
};
const makeMobileGroup = (label, items) => {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = label;
  details.append(summary);
  items.forEach((item) => details.append(makeLink(item)));
  return details;
};

const desktopMenu = document.querySelector('.menu');
if (desktopMenu) {
  desktopMenu.replaceChildren(
    makeDesktopGroup(['guide.html', '入園案内'], menuSections.admission),
    makeDesktopGroup(['life.html', '園の生活と行事'], menuSections.life),
    makeLink(['album.html', 'あいしんモーメント'], 'menu-direct'),
    makeDesktopGroup(['nozomikai.html', 'のぞみ会活動'], menuSections.nozomikai),
    makeLink(['playroom.html', '子育て支援'], 'menu-direct menu-playroom'),
    makeLink(['faq.html', 'よくある質問'], 'menu-direct'),
    makeDesktopGroup(['', 'その他'], menuSections.utility)
  );
}

const mob = document.querySelector('.mobile');
if (mob) {
  mob.replaceChildren(
    makeMobileGroup('入園案内', menuSections.admission),
    makeMobileGroup('園の生活と行事', menuSections.life),
    makeLink(['album.html', 'あいしんモーメント']),
    makeMobileGroup('のぞみ会活動', menuSections.nozomikai),
    makeLink(['playroom.html', '子育て支援']),
    makeLink(['faq.html', 'よくある質問']),
    makeMobileGroup('その他', menuSections.utility)
  );
}

const footerLinks = document.querySelector('.footer-links');
if (footerLinks) {
  const footerGroups = [
    ['入園案内', menuSections.admission],
    ['園の生活と行事', menuSections.life],
    ['のぞみ会活動', menuSections.nozomikai],
    ['その他', menuSections.other]
  ];
  footerLinks.replaceChildren(...footerGroups.map(([label, items]) => {
    const group = document.createElement('div');
    const heading = document.createElement('h4');
    heading.textContent = label;
    group.append(heading, ...items.map((item) => makeLink(item)));
    return group;
  }));
}

const hb = document.querySelector('.hamb');
if (hb && mob) {
  hb.type = 'button';
  hb.setAttribute('aria-expanded', 'false');
  hb.setAttribute('aria-controls', 'mobile-navigation');
  mob.id = 'mobile-navigation';
  hb.addEventListener('click', () => {
    const isOpen = mob.classList.toggle('open');
    hb.setAttribute('aria-expanded', String(isOpen));
    hb.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニュー');
    hb.textContent = isOpen ? '×' : '☰';
  });
}

// 共通フッターの4グループを、全ページで同じアコーディオンとして動作させる。
document.querySelectorAll('.footer-links > div').forEach((group) => {
  const heading = group.querySelector('h4');
  if (!heading) return;
  const details = document.createElement('details');
  details.className = 'footer-group';
  const summary = document.createElement('summary');
  summary.textContent = heading.textContent.trim();
  details.append(summary);
  group.querySelectorAll('a').forEach((link) => details.append(link));
  group.replaceWith(details);
});

// 公式サイトの「子育て支援プレイルーム」への導線を、その他メニューに補完する。
document.querySelectorAll('.footer-group').forEach((group) => {
  if (group.querySelector('a[href="playroom.html"]')) return;
  if (group.querySelector('summary')?.textContent.trim() !== 'その他') return;
  const link = document.createElement('a');
  link.href = 'playroom.html';
  link.textContent = '子育て支援プレイルーム';
  group.append(link);
});
document.querySelectorAll('.footer-group a').forEach((link) => {
  if (link.textContent.trim() === 'お問い合わせ') link.href = 'contact.html';
});
document.querySelectorAll('.footer-grid>div:first-child p').forEach((address) => {
  if (address.querySelector('.footer-email')) return;
  address.insertAdjacentHTML('beforeend', '<br><a class="footer-email" href="mailto:info@aishin.ed.jp">info@aishin.ed.jp</a>');
});

// あいしんモーメントは、現在運用中のInstagramへ案内する。
document.querySelectorAll('a[href="album.html"]').forEach((link) => {
  link.href = 'https://www.instagram.com/aishin.kindergarten/';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.classList.add('instagram-nav-link');
  if (link.querySelector('.instagram-icon')) return;
  const icon = document.createElement('span');
  icon.className = 'instagram-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1.2" class="instagram-dot"></circle></svg>';
  link.prepend(icon);
});

// メインページの導線も、生活と行事ページ全体の内容が伝わる表記にする。
const lifeQuickLink = document.querySelector('.quick a[href="life.html"]');
if (lifeQuickLink) {
  lifeQuickLink.querySelector('strong')?.replaceChildren(document.createTextNode('園の生活と行事'));
  lifeQuickLink.querySelector('small')?.replaceChildren(document.createTextNode('一日の流れ・年間行事'));
}

document.querySelectorAll('.filter').forEach((btn) => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  const category = btn.dataset.cat;
  document.querySelectorAll('.archive .post-card').forEach((card) => {
    card.hidden = !(category === 'all' || card.dataset.cat === category);
  });
}));

const page = location.pathname.split('/').pop() || 'index.html';
const content = window.AISHIN_OFFICIAL_CONTENT;
document.querySelectorAll('.menu a[href], .mobile a[href], .footer-group a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === page) link.classList.add('active');
});

if (page === 'moment-detail.html') {
  const notice = document.querySelector('main .notice');
  if (notice) {
    notice.innerHTML = '愛真幼稚園の日常と最新の活動は、<a class="inline-link" href="https://www.instagram.com/aishin.kindergarten/" target="_blank" rel="noopener noreferrer">公式Instagram</a>でもご覧いただけます。';
  }
}

if (page === 'admissions.html') {
  const admissionsFaq = document.querySelector('main #faq');
  if (admissionsFaq) {
    const faqLink = document.createElement('aside');
    faqLink.className = 'admissions-faq-link';
    faqLink.innerHTML = '<div><span class="kicker">Questions</span><strong>そのほかの疑問やご相談について</strong><p>園生活や入園に関する詳しい回答は「よくある質問」にまとめています。</p></div><a class="btn" href="faq.html">よくある質問を見る →</a>';
    admissionsFaq.replaceWith(faqLink);
  }
}

// メインページは、見学への案内を既存のボタンの直前に添える。
if (page === 'index.html') {
  const officialHero = document.querySelector('.main-photo');
  if (officialHero) {
    officialHero.src = 'assets/hero.png';
    officialHero.alt = 'とっとり自然保育認定園 愛真幼稚園';
  }
  document.querySelector('.moments-head')?.closest('.section')?.remove();
  const newsSection = document.querySelector('.news-layout')?.closest('.section');
  newsSection?.remove();
  const heroLead = document.querySelector('.hero .lead');
  if (heroLead && !heroLead.dataset.visitMessageAdded) {
    heroLead.append('　園庭、子どもたちの遊び、保育の空気。ホームページでは伝わりきらない愛真の日常を、実際にご覧ください。');
    heroLead.dataset.visitMessageAdded = 'true';
  }
  const schoolGuideButton = document.querySelector('.hero-buttons a[href="about.html"]');
  if (schoolGuideButton) {
    schoolGuideButton.href = 'guide.html';
    schoolGuideButton.textContent = '園を知る';
  }
}

// 大きなページタイトル帯を外し、本文にタイトルがないページだけ本文先頭へ補う。
if (page !== 'index.html') {
  const pageTitle = document.querySelector('.page-hero h1')?.textContent.trim();
  const mainContainer = document.querySelector('main > .container');
  if (pageTitle && mainContainer && !mainContainer.querySelector('h1, h2')) {
    const heading = document.createElement('h1');
    heading.className = 'main-page-title';
    heading.textContent = pageTitle;
    mainContainer.prepend(heading);
  }
}

const extraContent = {
  guide: `<section><span class="kicker">Guide</span><h2>入園案内</h2><p>愛真幼稚園は、とてもたのしい幼稚園です。ご入園する前に、教育方針などじっくりご覧ください。</p><img class="content-photo" src="assets/guide_hero_01.webp" alt="愛真幼稚園の園舎"><p>詳しい園での生活、年間の行事などは「園の生活と行事」ページをご覧ください。</p><div class="grid3"><article class="feature"><div class="body"><h3>募集要項</h3><p>「入園説明会」「募集要項」等の詳しい情報です。</p></div></article><article class="feature"><div class="body"><h3>園長あいさつ</h3><p>こんにちは。愛真幼稚園は、とても楽しい幼稚園です。</p></div></article><article class="feature"><div class="body"><h3>教育方針</h3><p>一世紀にわたって実践してきたキリスト教主義の保育をご案内します。</p></div></article></div></section>`
};
extraContent.guide = `<section class="guide-overview"><span class="kicker">Guide</span><h2>入園案内</h2><p>愛真幼稚園は、とてもたのしい幼稚園です。ご入園する前に、教育方針などじっくりご覧ください。</p><img class="content-photo" src="assets/guide_hero_01.webp" alt="愛真幼稚園の園舎と園庭"><p>尚、詳しい園での生活、年間の行事などは<a class="inline-link" href="life.html">「園の生活と行事」ページ</a>をご覧ください。</p><div class="grid3 guide-links"><a class="feature" href="apply.html"><div class="body"><span class="tag orange">Admission</span><h3>募集要項</h3><p>「入園説明会」「募集要項」等の詳しい情報です。</p><span class="more">詳しく見る →</span></div></a><a class="feature" href="greeting.html"><div class="body"><span class="tag">Message</span><h3>園長あいさつ</h3><p>こんにちは。愛真幼稚園は、とても楽しい幼稚園です。</p><span class="more">詳しく見る →</span></div></a><a class="feature" href="policy.html"><div class="body"><span class="tag blue">Policy</span><h3>教育方針</h3><p>愛真幼稚園は、一世紀にわたってキリスト教主義の保育を実践してきました。</p><span class="more">詳しく見る →</span></div></a><article class="feature feature-disabled"><div class="body"><span class="tag orange">準備中</span><h3>職員・クラス・保育時間</h3><p>現在の職員構成、クラスの人数、保育時間をご案内します。</p><span class="more">詳細ページ準備中</span></div></article><a class="feature" href="history.html"><div class="body"><span class="tag">History</span><h3>沿革</h3><p>愛真幼稚園、創立からの歩みをご紹介します。</p><span class="more">詳しく見る →</span></div></a></div></section>`;
extraContent.greeting = `<section id="message" class="greeting-content"><span class="kicker">Message</span><h2>園長あいさつ</h2><p>愛真幼稚園はキリスト教精神に基づいて幼児教育を担う幼稚園です。「神を愛し、人を愛す心」を教育の基本と考えます。神の守りと導きを信じ、神の愛に応えられるように、子ども達を育てていきたいと願っています。</p><p>愛真幼稚園は、神様が造られた自然を愛することも大事にし、「遊びの保育」「自然保育」にこだわる幼稚園です。園庭には50種類以上の木が植えられ、種々の果物が実を結びます。畑に子ども達が種をまき、水をやり、収穫します。花を摘み、虫を探します。ツリーハウスに登ったり、泥んこ遊びをしたり、池でメダカやアメンボをすくったり、夏は裸足で園庭を駆け回ります。園舎は智頭杉をふんだんに使った建物です。子ども達は一年中裸足で木の温もりを感じて過ごします。</p><div class="quote">子ども達が、神と人を愛し、愛され、感性豊かに伸び伸び活き活きと育ちますように、職員一同祈りをもって励んでいます。</div><p>毎週お弁当を持って園外保育に出掛けます。時には山登りや川遊びをしたり、果物の収穫やイモ掘りに行ったりします。森で山菜採りをすることや、田んぼで代掻きや田植えをすることもあります。竹の子掘りやソラマメ収穫の翌日は、園庭で焚火をしてバーベキューです。</p><p>愛真幼稚園は食にもこだわる幼稚園です。味覚は大事な五感の一つです。給食は昆布や煮干しで出汁を取り、食材に添加物食品は極力使わず、多くを手作りしています。食材の種類を豊富にし、自然の恵み本来の味を大事にしています。子ども達が園庭で育てた野菜の味は格別です。</p><div class="grid3 message-highlights"><article class="feature"><div class="body"><span class="tag">礼拝</span><h3>毎日礼拝を守り、お祈りをします。</h3></div></article><article class="feature"><div class="body"><span class="tag orange">遊び</span><h3>木のおもちゃたっぷりのお部屋や、自然がいっぱいの園庭で思いっきり遊びます。</h3></div></article><article class="feature"><div class="body"><span class="tag blue">木の園舎</span><h3>智頭杉をふんだんに使った園舎は木の香りに包まれ、一年中裸足で過ごせます。</h3></div></article><article class="feature"><div class="body"><span class="tag">生活</span><h3>お部屋にはテレビがありません。実体験を大切にしています。</h3></div></article><article class="feature"><div class="body"><span class="tag orange">食育</span><h3>園庭の畑で野菜を育て、収穫し、調理して食べます。</h3></div></article><article class="feature"><div class="body"><span class="tag blue">絵本</span><h3>「えほんのへや」と各お部屋には楽しい絵本がいっぱいです。</h3></div></article><article class="feature"><div class="body"><span class="tag">ことば</span><h3>人のお話をよく聞き、自分のことばで考え、表現します。</h3></div></article><article class="feature"><div class="body"><span class="tag orange">給食</span><h3>栄養士の指導のもと、年齢に適した栄養バランスのよいメニューを提供します。</h3></div></article></div><p>愛真幼稚園の子どもたちの毎日は楽しい体験の連続です。幼子が神と人に愛される者として成長していくことを願っています。</p><p>園の生活の詳しいお話は、<a class="inline-link" href="life.html">「園の生活と行事」ページ</a>をご覧ください。</p></section>`;
extraContent.policy = `<section id="policy" class="policy-content policy-layout"><span class="kicker">Policy</span><h2>教育方針</h2><div class="policy-words"><section class="policy-panel"><span class="policy-label">教育方針</span><p>愛真幼稚園はキリスト教主義により、神様から与えられた幼子を大切に育てます。神への感謝と友だちを大切にする、健全な人格の育成を目指します。</p></section><section class="policy-panel policy-panel-warm"><span class="policy-label">園の目標</span><p>幼子が神から与えられた自然の中で、「あそび保育」を通して、豊かな感性、観察力、創造性、社会性を身に付け、成長していく手助けをします。</p></section></div><section class="policy-children"><span class="policy-label">Children we hope to nurture</span><h3>めざす子ども像</h3><div class="policy-child-list"><p><b>01</b><span>神を敬い、感謝と喜びをもって生きる子ども</span></p><p><b>02</b><span>生命力、生活力にあふれた、元気いっぱいの子ども</span></p><p><b>03</b><span>お互いの違いを認め合い、共に生き平和をつくり出す子ども</span></p><p><b>04</b><span>意欲をもって、主体的に生活を創造していく子ども</span></p></div></section><section class="policy-certification"><div class="policy-cert-copy"><span class="policy-label">Nature-based Education</span><h3>とっとり自然保育認定園です。</h3><p>当園は、子どもたちの「体力の向上」「感性」「探究心」「集中力」「自ら考える力」などを育成する場の一つとして、鳥取県の豊かな自然を活用した自然体験活動を行う幼稚園として、鳥取県から認定されています。</p><p>園外保育で接する鳥取の恵まれた自然環境の中で、のびのびと遊んでいます。</p></div><img class="policy-cert-badge" src="assets/policy_badge1.jpg" alt="とっとり自然保育認定園"></section><div class="photo-gallery policy-gallery"><h3>活動の様子</h3><img src="assets/policy_gallery_photo1.jpg" alt="自然保育の活動の様子" loading="lazy"><img src="assets/policy_gallery_photo2.jpg" alt="自然保育の活動の様子" loading="lazy"><img src="assets/policy_gallery_photo3.jpg" alt="自然保育の活動の様子" loading="lazy"><img src="assets/policy_gallery_photo4-1.jpg" alt="自然保育の活動の様子" loading="lazy"><img src="assets/policy_gallery_photo5.jpg" alt="自然保育の活動の様子" loading="lazy"><img src="assets/policy_gallery_photo6.jpg" alt="自然保育の活動の様子" loading="lazy"></div></section>`;
extraContent.admissions = `<section class="admissions-content"><span class="kicker">Admission</span><h2>募集要項</h2><div class="notice admission-status"><strong>※全学年入園受付中</strong><span>募集要項、願書などは前年3月頃に改訂を行っています。翌年入園を検討されている方は参考になさってください。</span></div><nav class="admission-index" aria-label="募集要項の目次"><a href="#admission-capacity">募集人数</a><a href="#admission-flow">入園までの流れ</a><a href="#admission-visit">説明会・願書受付</a><a href="#admission-fees">納付金</a><a href="#admission-care">預かり保育</a></nav><section id="admission-capacity" class="admission-section"><span class="policy-label">Capacity</span><h3>募集人数</h3><p>人数によっては2クラス編成になります。障がいのあるお子様、アレルギーのあるお子様の入園に対応しています。</p><div class="capacity-table"><div class="capacity-head"><b>学年・クラス</b><b>2025年度</b><b>2026年度</b></div><div><strong>満3歳児（りす組）</strong><span>20名</span><span>20名程度</span><small>2025：令和4年4月2日以降生まれ<br>2026：令和5年4月2日以降生まれで、3歳の誕生日を迎えたお子様（誕生日前日から入園可）</small></div><div><strong>年少児（ひつじ組）</strong><span>若干名</span><span>20名程度</span><small>2025：令和3年4月2日～令和4年4月1日生まれ<br>2026：令和4年4月2日～令和5年4月1日生まれ</small></div><div><strong>年中児（ぶどう組）</strong><span>若干名</span><span>若干名</span><small>2025：令和2年4月2日～令和3年4月1日生まれ<br>2026：令和3年4月2日～令和4年4月1日生まれ</small></div><div><strong>年長児（にじ組）</strong><span>若干名</span><span>若干名</span><small>2025：平成31年4月2日～令和2年4月1日生まれ<br>2026：令和2年4月2日～令和3年4月1日生まれ</small></div></div></section><section id="admission-flow" class="admission-section"><span class="policy-label">Process</span><h3>入園までの流れ</h3><div class="admission-steps"><div><b>A</b><strong>新年度4月入園</strong><p>園の見学・ご相談は随時受け付けています。</p></div><div><b>B</b><strong>年度途中での入園</strong><p>途中入園希望の方もお気軽にお問い合わせください。</p></div><div><b>C</b><strong>満3歳児（りす組）</strong><p>3歳の誕生日を迎えたお子様は、誕生日前日から入園できます。</p></div></div></section><section id="admission-visit" class="admission-section"><span class="policy-label">Information</span><h3>説明会・願書受付</h3><div class="info-pairs"><div><b>園の見学・ご相談</b><span>随時受付（電話でご連絡ください）</span></div><div><b>新入園児説明会</b><span>入園受付完了時にお知らせします。</span></div><div><b>願書受付（予定）</b><span>10月初日（土・日・祝の場合は翌日）から、午前9時より募集人数が満たされるまで順次受け付けます。</span></div></div><h4>必要書類</h4><p>願書、診断書、愛真幼稚園個人情報保護に関する基本方針。書類用紙は園にもあります。簡単な親子面接を行い、テストはいたしません。園生活に備えて心配なことなどをお聴きし、園の方針に賛同していただける方の入園を許可します。</p><div class="download-placeholder"><div><span class="policy-label">Downloads</span><h4>募集要項・願書などの資料</h4><p>資料のダウンロード機能は、後日外部サービスへ接続予定です。</p></div><span class="download">後日掲載</span></div></section><section id="admission-fees" class="admission-section"><span class="policy-label">Fees</span><h3>納付金について</h3><p>2024年4月より、本園は「私学助成を受ける幼稚園」から「子ども・子育て支援新制度による施設型給付を受ける幼稚園」へ移行しました。</p><div class="fee-grid"><div><b>入園時納付金</b><strong>21,800円〜25,300円</strong><span>環境整備協力金20,000円＋入園グッズ代1,800円（満3歳）〜5,300円（年長）</span><small>制服・体操服・靴などの購入はありません。</small></div><div><b>月額納付金</b><strong>諸経費 7,000円</strong><span>給食費6,000円、冷暖房費500円、園外保育バス代500円、PTA会費500円</span><small>副食助成対象者には上限4,500円/月の副食費相当額が支給されます。</small></div><div><b>通園バス利用費</b><strong>往復 4,000円 ／ 片道 2,000円</strong><span>その他月額納付金として、バス利用者のみ対象です。</span></div></div></section><section id="admission-care" class="admission-section"><span class="policy-label">After-school Care</span><h3>預かり保育（時間外保育）</h3><p>通常保育日・長期休業中も早朝7：30から延長19：00までお子様をお預かりします。土日祝、お盆・年末年始などは休園です。</p><div class="care-hours"><div><b>早朝預かり</b><span>7：30〜保育前</span></div><div><b>なかよしルーム</b><span>保育後〜18：00<br>長期休業中は8：15〜19：00</span></div><div><b>延長預かり</b><span>18：00〜19：00</span></div></div><p>自然いっぱいの園庭やお部屋でたっぷり遊ぶ異年齢保育です。定期的な利用（年・月契約）のほか、臨時利用もできます。2号・3号認定のお子様は、一定条件で実質負担0円になります。</p><div class="care-notes"><p><b>早朝</b> 年間6,000円／月1,000円／臨時200円</p><p><b>なかよしルーム</b> 年契約4,500円/月、月契約5,500円/月、臨時500円/日（長期休業中は1,000円/日）</p><p><b>延長</b> 年間6,000円／月1,000円／臨時200円</p></div><p class="small-note">長期休業中は給食とおやつ代350円/日が別途必要です。詳しくは園までお問い合わせください。</p></section></section>`;
extraContent.lifeOverview = `<section class="life-overview"><span class="kicker">Daily Life & Events</span><h2>園の生活と行事</h2><p class="life-lead">他の人と一緒に歩む喜びや力、目に見えないものを大切にする気持ち、希望を失わない心などが豊かに育まれていく生活を送ります。</p><img class="content-photo" src="assets/ouen_photo1.jpg" alt="愛真幼稚園の園生活"><div class="life-menu"><a href="safe.html"><span>01</span><div><h3>安全・衛生について</h3><p>子どもたちが安心して過ごせるための取り組みや、緊急時の対応をご案内します。</p></div><b>→</b></a><a href="annual.html"><span>02</span><div><h3>年間行事予定</h3><p>一年間のイベントスケジュールです。季節ごとの行事をご紹介します。</p></div><b>→</b></a><a href="schedule.html"><span>03</span><div><h3>一日の流れ</h3><p>愛真幼稚園で過ごす一日の基本タイムテーブルです。</p></div><b>→</b></a><a href="lunch.html"><span>04</span><div><h3>給食</h3><p>旬の食材と手作りを大切にした、楽しみになる給食をご紹介します。</p></div><b>→</b></a><a href="map.html"><span>05</span><div><h3>園内探索マップ</h3><p>木の園舎と自然いっぱいの園庭を、園内マップでご覧いただけます。</p></div><b>→</b></a><a href="bus.html"><span>06</span><div><h3>通園バスコース</h3><p>バスコース、利用時の注意点、運行についてのご案内です。</p></div><b>→</b></a></div></section>`;
extraContent.safe = `<section class="safe-page"><span class="kicker">Safety & Hygiene</span><h2>安全・衛生について</h2><section class="safe-intro"><h3>子ども達が安心して過ごせるように</h3><p>愛真幼稚園では、子ども達が安心して過ごせるよう防犯カメラ、鳥取県警本部直通非常通報装置、山陰警備保障直通ペンダントを設置し、定期的に避難訓練や不審者対応訓練を行うなど、安全と衛生に配慮した様々な取り組みを行っています。</p><p>また、常日頃から職員一人ひとりが子ども達の事を考え、寄り添い、見守るよう心がけています。</p></section><div class="safe-grid"><section><span class="safe-label">Health</span><h3>健康管理</h3><ul><li>身体測定（学期ごと）</li><li>健康診断（内科・歯科・尿）</li><li>アレルギー除去食への対応</li><li>感染症の拡大防止マニュアル</li><li>栄養士による食育指導</li></ul></section><section><span class="safe-label">Accident Prevention</span><h3>事故防止</h3><ul><li>設備の定期的な安全点検</li><li>ケガや事故を防止するための設備設計</li><li>園外保育のためのリスクマネジメント</li><li>園舎・園庭見回り隊を毎月実施</li></ul></section><section><span class="safe-label">Hygiene</span><h3>衛生管理</h3><ul><li>全職員の健康診断</li><li>手洗いの徹底</li><li>ペーパータオルの使用</li><li>薬剤師による定期検査（水質・採光・照明・空気・騒音・ダニ検査など）</li></ul></section><section><span class="safe-label">Disaster Prevention</span><h3>災害・人災対策</h3><ul><li>不審者対応訓練の実施</li><li>避難訓練（引き渡し訓練）</li><li>防災設備の定期的な点検</li><li>バス避難訓練</li><li>交通・生活安全教室</li></ul></section></div><section class="safe-section"><span class="safe-label">Emergency</span><h3>緊急時の対応について</h3><ul><li>お知らせいただいた緊急連絡先に、優先順位に沿って連絡します。</li><li>一斉に連絡する場合は、ご登録いただいたメールアドレスにメールを一斉配信します。</li></ul><h4>病気・けがの際の措置</h4><div class="safe-notice"><strong>熱がある場合</strong><p>保育中に37.5℃以上の熱がある場合は、事前にお聞きしている連絡先にお迎えの連絡をしますので、なるべく早いお迎えと医療機関での受診をお願いします。</p></div><div class="safe-notice"><strong>ケガや体調不良の場合</strong><p>保育中にケガおよび不調がみられた場合は、保護者に様子を連絡し、医療機関を受診することがあります。連絡が取れない場合でも、園児の安全を優先して、園の判断で医療機関を受診することがあります。</p></div></section><section class="safe-section"><span class="safe-label">Medical Support</span><h3>嘱託医・嘱託歯科医</h3><div class="medical-list"><div><strong>嘱託医：たなか小児科医院</strong><p>〒680-0844 鳥取県鳥取市興南町76<br>TEL：0857-21-1222</p></div><div><strong>嘱託歯科医：松下歯科医院</strong><p>〒680-0831 鳥取県鳥取市栄町763 メルヘンビル<br>TEL：0857-22-8212／0120-379-078</p></div></div><div class="download-placeholder safe-download"><div><span class="safe-label">Documents</span><h4>登園許可書類</h4><p>各種申込用紙・登園許可書類のダウンロードは、後日外部サービスへ接続予定です。</p></div><span class="download">後日掲載</span></div></section><section class="safe-section"><span class="safe-label">Insurance</span><h3>保険について</h3><div class="insurance-list"><div><strong>幼稚園賠償責任保険</strong><span>保険掛け金は、全額 園が負担します。</span></div><div><strong>独立行政法人 日本スポーツ振興センター 災害共済給付</strong><span>保険掛け金の一部を保護者負担。</span></div><div><strong>行事参加者傷害危険担保保険</strong><span>保険掛け金は、全額 園が負担します。</span></div><div><strong>園児総合保障制度「園児24保険」</strong><span>保護者の任意加入です。直接お申込みください。<br>申込先：東京海上日動火災保険バード保険事務所（0857-29-0557）</span></div></div></section><section class="safe-section safe-weather"><span class="safe-label">Weather & Closure</span><h3>急な休園について</h3><p>警報が出るほどの荒天や、感染症などの蔓延予防などの理由で、急な休園または自由登園になる場合があります。自由登園は保育日ではありませんので、登園されなくても欠席にはなりません。できるだけ家で過ごしてください。</p></section><section class="safe-section"><span class="safe-label">Disaster & Crime Prevention</span><h3>災害・人災への対策について</h3><p>火災・地震などに備えて、定期的に職員・園児の避難訓練を実施します。また、保護者へも緊急連絡手段を周知します。</p><ul><li>防災設備：消火器、火災報知器、誘導灯、避難器具</li><li>防犯対策：職員・園児に不審者対策訓練を実施</li><li>防犯設備：通用口の施錠、防犯カメラの設置</li></ul></section></section>`;
extraContent.annual = `<section class="annual-page"><span class="kicker">Annual Events</span><h2>年間行事予定</h2><p class="annual-lead">季節の移り変わりを感じながら、子どもたちはさまざまな体験を重ねていきます。</p><div class="annual-months"><article class="annual-month"><img src="assets/life-annual/annual_photo1.jpg" alt="4月の行事"><div><span>4月</span><p>新年度始業式、入園式<br>のぞみ会総会、組別懇談会<br>新入園児歓迎なかよしパーティー<br>親子遠足（雨天決行）<br>誕生会（4・5月生まれ）<br>収穫体験（竹の子、山菜）<br>登山（年長）</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo2.jpg" alt="5月の行事"><div><span>5月</span><p>内科健診<br>一斉引き渡し訓練<br>バス避難訓練<br>収穫体験（空豆）</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo3.jpg" alt="6月の行事"><div><span>6月</span><p>時計屋さんの話<br>歯の話、歯科検診<br>誕生会（6・7月生まれ）<br>お泊り保育保護者会<br>避難訓練（火災）<br>収穫体験（梅、グミ）</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo4.jpg" alt="7月の行事"><div><span>7月</span><p>年長組お泊まり保育<br>個別懇談会<br>川遊び<br>終業式</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo5.jpg" alt="8月の行事"><div><span>8月</span><p>にじほしのひ（卒園生同窓会）<br>あいしんまつり</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo6.jpg" alt="9月の行事"><div><span>9月</span><p>2学期始業式<br>誕生会（8・9月生まれ）<br>祖父母招待日（年長組）<br>避難訓練（地震）</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo7.jpg" alt="10月の行事"><div><span>10月</span><p>運動会<br>収穫体験（芋掘り）</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo8.jpg" alt="11月の行事"><div><span>11月</span><p>もちつき<br>感謝祭<br>個別懇談会<br>誕生会（10・11月生まれ）</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo9.jpg" alt="12月の行事"><div><span>12月</span><p>クリスマス<br>あいしんようちえんバザー<br>終業式</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo10.jpg" alt="1月の行事"><div><span>1月</span><p>3学期始業式<br>誕生会（12・1月生まれ）<br>リズム遊び参観日<br>洪水避難訓練</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo11.jpg" alt="2月の行事"><div><span>2月</span><p>お楽しみ会、組別懇談会<br>誕生会（2・3月生まれ）<br>入園説明会</p></div></article><article class="annual-month"><img src="assets/life-annual/annual_photo12.jpg" alt="3月の行事"><div><span>3月</span><p>お別れ会<br>バイキング<br>卒園式<br>年度修了式</p></div></article></div><section class="annual-year-round"><span class="safe-label">All Year Round</span><h3>通年行事</h3><div><article><strong>安全教育</strong><p>交通指導・避難訓練・不審者対応の訓練・バス訓練をします。</p></article><article><strong>誕生会</strong><p>2ヶ月に1回、チャペルホールでお祝いし、その後、各部屋で誕生児親子は一緒に給食を食べます。</p></article><article><strong>園外保育</strong><p>毎週火曜日（天候により中止の場合あり）。お弁当持参で出かけます。</p></article><article><strong>チャーチタイム</strong><p>教会で聖書の話を聞き、一緒に礼拝をします。</p></article><article><strong>園庭開放</strong><p>月に一回、降園時から16時まで親子で遊べます。</p></article></div></section></section>`;
extraContent.schedule = `<section class="schedule-page"><span class="kicker">A Day at Aishin</span><h2>愛真幼稚園の1日</h2><div class="timeline schedule-timeline"><div class="time-item"><b>7：30～8：15</b><div class="schedule-copy"><h4>早朝預かり保育</h4></div></div><div class="time-item"><b>8：15～9：00</b><div class="schedule-copy"><h4>登園</h4><figure class="schedule-photo"><img src="assets/life-schedule/main_photo1.jpg" alt="登園する子どもたち" loading="lazy"></figure><p>まずは、朝のごあいさつ。「おはようございます。」</p><p>朝の準備をします。自分の荷物は自分で整えましょう。</p></div></div><div class="time-item"><b>9：00～</b><div class="schedule-copy"><h4>活動</h4><figure class="schedule-photo"><img src="assets/life-schedule/main_photo2.jpg" alt="室内で遊ぶ子どもたち" loading="lazy"></figure><p>登園後、室内で自ら選んで行う活動と、みんなで行う活動があります。</p><p>今日は何して遊ぼうかな？</p></div></div><div class="time-item"><b>10：30～</b><div class="schedule-copy"><h4>クラス全体でのお集まり</h4><figure class="schedule-photo"><img src="assets/life-schedule/main_photo7.jpg" alt="リズム遊びの様子" loading="lazy"></figure><p>毎日礼拝をします。その後、子どもたちの発達に合わせて、絵画、製作指導やさくら さくらんぼ（リズム遊び）などをして過ごします。</p><h5>●自ら選んで行う活動</h5><p>晴れた日は園庭で、雨天の日はホールやお部屋で思いきり遊びます。</p></div></div><div class="time-item"><b>11：30～</b><div class="schedule-copy"><h4>給食配膳の準備</h4><div class="schedule-photo-pair"><figure class="schedule-photo"><img src="assets/life-schedule/main_photo3.jpg" alt="給食を食べる子どもたち" loading="lazy"></figure><figure class="schedule-photo"><img src="assets/life-schedule/main_photo4.jpg" alt="食後の歯みがき" loading="lazy"></figure></div><p>配膳は自分でします。こぼさずに上手に運べるかな？</p><h5>●食前のお祈り・食事</h5><p>食事前のお祈りをして、感謝していただきます。</p><h5>●片付け・休憩</h5><p>食事後、食器の片付けを各自で行い、歯みがきをした後、絵本やあやとりなどで静かに待ちます。</p><h5>●お話の時間</h5><p>みんながお待ちかね、絵本の読み聞かせの時間です。</p></div></div><div class="time-item"><b>13：00～</b><div class="schedule-copy"><h4>自由遊び</h4><figure class="schedule-photo"><img src="assets/life-schedule/main_photo5.jpg" alt="園庭で遊ぶ子どもたち" loading="lazy"></figure><p>楽しくあそんだ後のお片づけと、降園の準備をします。忘れ物はないかな～？</p></div></div><div class="time-item"><b>13：30～</b><div class="schedule-copy"><h4>帰りの会</h4><figure class="schedule-photo"><img src="assets/life-schedule/main_photo6_1.jpg" alt="室内活動の様子" loading="lazy"></figure><h5>●わらべうた・集団あそび</h5><p>今日のあそびについてと明日の予定連絡・集団あそびなどを行います。</p></div></div><div class="time-item"><b>14：00～</b><div class="schedule-copy"><h4>順次降園・バス待ち</h4><p>バス利用者はバスを待ちます。</p><h4>なかよしルーム（預かり保育）</h4><p>異年齢（3から5歳）で自由遊びをします。</p></div></div><div class="time-item"><b>15：00～</b><div class="schedule-copy"><h4>おやつ・順次降園</h4><h5>●食事前のお祈り</h5><p>食事前のお祈りをして感謝をしていただきます。</p></div></div><div class="time-item"><b>15：30～</b><div class="schedule-copy"><h4>自由遊び</h4><figure class="schedule-photo"><img src="assets/life-schedule/main_photo8.jpg" alt="園庭で自由に遊ぶ子どもたち" loading="lazy"></figure><p>園庭やお部屋で自由遊びをします。</p></div></div><div class="time-item"><b>18：00～19：00</b><div class="schedule-copy"><h4>延長預かり保育</h4></div></div></div></section>`;
extraContent.lunch = `<section id="meal" class="lunch-page"><span class="kicker">Lunch & Food Education</span><h2>給食</h2><section class="lunch-intro"><div><h3>愛真幼稚園の給食は</h3><ul><li>栄養士の指導のもと、栄養計算を行い年齢に適した「栄養バランスの良いメニュー」です。</li><li>自園栽培や子ども達が収穫した食材を使用した給食を実施しています。</li><li>旬の食材を積極的に使用し、汁物や煮物は煮干しなどでだしをとっています。</li><li>手作りを心がけ、既製品をできるだけ控えた給食を提供しています。</li><li>イベントや誕生会の日には特別メニューを提供しています。</li><li>アレルギー対応を行っていますので、ご相談下さい。</li><li>火曜日はご家庭よりお弁当をご持参ください。</li></ul><p class="lunch-message">給食の先生の愛情エキスがたっぷり入った自慢の手作り給食です。</p></div><div class="lunch-illustration"><img src="assets/life-lunch/obj1.png" alt="給食を彩る風船のイラスト"><img src="assets/life-lunch/lunch_illustration.png" alt="子どもたちと動物が給食を楽しむイラスト"></div></section><div class="lunch-feature-photos"><figure><img src="assets/life-lunch/photo1_01.jpg" alt="子どもたちが給食を食べる様子" loading="lazy"><figcaption>みんなで楽しくいただきます。</figcaption></figure><figure><img src="assets/life-lunch/photo2_01.jpg" alt="給食を作る職員" loading="lazy"><figcaption>給食の先生が心を込めて手作りします。</figcaption></figure></div><section class="menu-diary"><span class="kicker">Menu Diary</span><h3>献立日記</h3><div class="menu-diary-grid"><article><img src="assets/life-lunch/menu_2026-07-16.jpg" alt="2026年7月16日の給食" loading="lazy"><div><time datetime="2026-07-16">2026年07月16日</time><ul><li>なすミートスパゲティー</li><li>かぼちゃチップ</li><li>りっちゃんサラダ</li><li>フルーツゼリー</li></ul></div></article><article><img src="assets/life-lunch/menu_2026-07-15.jpg" alt="2026年7月15日の給食" loading="lazy"><div><time datetime="2026-07-15">2026年07月15日</time><ul><li>とりそぼろ混ぜごはん</li><li>もやしとコーンのみそ汁</li><li>あじフライ</li><li>やさいのごま和え</li><li>バナナ</li></ul></div></article><article><img src="assets/life-lunch/menu_2026-07-13.jpg" alt="2026年7月13日の給食" loading="lazy"><div><time datetime="2026-07-13">2026年07月13日</time><ul><li>ごはん</li><li>わかめスープ</li><li>ポークビーンズ</li><li>小松菜のツナ和え</li><li>牛乳</li></ul></div></article><article><img src="assets/life-lunch/menu_2026-07-08.jpg" alt="2026年7月8日の給食" loading="lazy"><div><time datetime="2026-07-08">2026年07月08日</time><ul><li>ごはん</li><li>中華スープ</li><li>厚揚げと豚肉のみそ煮</li><li>もやしのゆかり和え</li><li>バナナヨーグルト</li></ul></div></article></div></section><div class="lunch-decor" aria-hidden="true"><img src="assets/life-lunch/obj3.png" alt=""><img src="assets/life-lunch/obj4.png" alt=""></div></section>`;
extraContent.lunchRefined = `<section id="meal" class="lunch-page lunch-page-refined"><header class="lunch-hero-refined"><div class="lunch-hero-copy"><span class="kicker">Lunch & Food Education</span><h2>給食</h2><p class="lunch-hero-lead">子どもたちの「おいしい！」を育てる、<br>愛情たっぷりの手作り給食です。</p><p>栄養士と給食の先生が、毎日の成長と旬の恵みを大切にしながら、一食一食をつくっています。</p></div><div class="lunch-hero-art"><img src="assets/life-lunch/lunch_illustration.png" alt="子どもたちが給食を楽しむイラスト"></div></header><section class="lunch-promises"><article><span>01</span><h3>栄養バランス</h3><p>栄養士の指導のもと、栄養計算を行い、年齢に適したメニューを提供します。</p></article><article><span>02</span><h3>自園栽培</h3><p>自園栽培や子どもたちが収穫した食材を、給食に使用します。</p></article><article><span>03</span><h3>旬とだし</h3><p>旬の食材を積極的に取り入れ、汁物や煮物は煮干しなどでだしをとります。</p></article><article><span>04</span><h3>手づくり</h3><p>既製品をできるだけ控え、イベントや誕生会には特別メニューも用意します。</p></article></section><section class="lunch-detail-refined"><div><h3>愛真幼稚園の給食は</h3><p class="lunch-message">給食の先生の愛情エキスがたっぷり入った自慢の手作り給食です。</p></div><ul><li><b>アレルギー対応</b><span>アレルギー対応を行っていますので、ご相談下さい。</span></li><li><b>火曜日のお弁当</b><span>火曜日はご家庭よりお弁当をご持参ください。</span></li></ul></section><section class="lunch-scenes"><figure><img src="assets/life-lunch/photo1_01.jpg" alt="子どもたちが給食を食べる様子" loading="lazy"><figcaption><strong>みんなで楽しくいただきます。</strong><span>食べる時間も、育ちにつながる大切なひとときです。</span></figcaption></figure><figure><img src="assets/life-lunch/photo2_01.jpg" alt="給食を作る職員" loading="lazy"><figcaption><strong>心を込めて、園内で手づくり。</strong><span>給食の先生が毎日の食卓を支えます。</span></figcaption></figure></section><section class="menu-diary menu-diary-refined"><div class="menu-diary-heading"><div><span class="kicker">Menu Diary</span><h3>献立日記</h3></div><p>毎日の給食から、最近のメニューをご紹介します。</p></div><div class="menu-diary-grid"><article><img src="assets/life-lunch/menu_2026-07-16.jpg" alt="2026年7月16日の給食" loading="lazy"><div><time datetime="2026-07-16">2026年07月16日</time><ul><li>なすミートスパゲティー</li><li>かぼちゃチップ</li><li>りっちゃんサラダ</li><li>フルーツゼリー</li></ul></div></article><article><img src="assets/life-lunch/menu_2026-07-15.jpg" alt="2026年7月15日の給食" loading="lazy"><div><time datetime="2026-07-15">2026年07月15日</time><ul><li>とりそぼろ混ぜごはん</li><li>もやしとコーンのみそ汁</li><li>あじフライ</li><li>やさいのごま和え</li><li>バナナ</li></ul></div></article><article><img src="assets/life-lunch/menu_2026-07-13.jpg" alt="2026年7月13日の給食" loading="lazy"><div><time datetime="2026-07-13">2026年07月13日</time><ul><li>ごはん</li><li>わかめスープ</li><li>ポークビーンズ</li><li>小松菜のツナ和え</li><li>牛乳</li></ul></div></article><article><img src="assets/life-lunch/menu_2026-07-08.jpg" alt="2026年7月8日の給食" loading="lazy"><div><time datetime="2026-07-08">2026年07月08日</time><ul><li>ごはん</li><li>中華スープ</li><li>厚揚げと豚肉のみそ煮</li><li>もやしのゆかり和え</li><li>バナナヨーグルト</li></ul></div></article></div></section><div class="lunch-decor" aria-hidden="true"><img src="assets/life-lunch/obj3.png" alt=""><img src="assets/life-lunch/obj4.png" alt=""></div></section>`;
extraContent.mapRefined = `<section id="map" class="map-page"><header class="map-hero"><div><span class="kicker">Explore Aishin</span><h2>園内探索マップ</h2><p>園内を探検してみよう！</p></div><img src="assets/life-map/obj3.png" alt="星のイラスト"></header><section class="map-streetview"><div><span class="map-label">Street View</span><h3>ストリートビューで探検する</h3><p>園内の様子を、ストリートビューでもご覧いただけます。</p></div><div class="external-placeholder"><span>Google Street View</span><strong>後日、外部サービスへ接続予定です。</strong></div></section><section class="map-plans"><span class="map-label">Floor Plans</span><h3>園内の全体像</h3><div class="map-plan-grid"><figure><picture><source media="(max-width:640px)" srcset="assets/life-map/map_01_sp.png"><img src="assets/life-map/map_01.png" alt="愛真幼稚園の園内マップ" loading="lazy"></picture><figcaption>園内マップ</figcaption></figure><figure><picture><source media="(max-width:640px)" srcset="assets/life-map/map_02_sp.webp"><img src="assets/life-map/map_02.webp" alt="愛真幼稚園の園内探索マップ" loading="lazy"></picture><figcaption>園内探索マップ</figcaption></figure></div></section><section class="map-places"><div class="map-section-heading"><div><span class="map-label">Inside Aishin</span><h3>園内の紹介</h3></div><img src="assets/life-map/obj4.png" alt="ハートのイラスト"></div><div class="map-place-grid"><article><img src="assets/life-map/photo1.jpg" alt="テラス" loading="lazy"><div><h4>テラス</h4><p>子どもたちは、この下駄箱に靴を入れてお部屋に入ります。</p></div></article><article><img src="assets/life-map/photo2.jpg" alt="絵本の部屋" loading="lazy"><div><h4>絵本の部屋</h4><p>昔話や図鑑、物語絵本などたくさんの絵本がそろっています。</p></div></article><article><img src="assets/life-map/photo3.jpg" alt="給食室" loading="lazy"><div><h4>給食室</h4><p>幼稚園の給食をつくる場所です。</p></div></article><article><img src="assets/life-map/photo4.jpg" alt="応接室" loading="lazy"><div><h4>応接室</h4><p>会合に使います。</p></div></article><article><img src="assets/life-map/photo5.jpg" alt="玄関" loading="lazy"><div><h4>玄関</h4><p>お客様専用の玄関です。</p></div></article><article><img src="assets/life-map/photo6.jpg" alt="職員室" loading="lazy"><div><h4>職員室</h4><p>先生たちのお部屋です。</p></div></article><article><img src="assets/life-map/photo7.jpg" alt="EV（エレベーター）" loading="lazy"><div><h4>EV（エレベーター）</h4><p>障がいのある子どもや高齢者が利用したり、給食の運搬にも利用します。</p></div></article><article><img src="assets/life-map/photo8.jpg" alt="WC（園児用トイレ）" loading="lazy"><div><h4>WC（園児用トイレ）</h4><p>各部屋からすぐに利用でき、子どもたちも安心のトイレです。</p></div></article><article><img src="assets/life-map/photo9.jpg" alt="チャペルホール" loading="lazy"><div><h4>チャペルホール</h4><p>子どもたちの遊び場、又、式典に利用します。</p></div></article><article><img src="assets/life-map/photo10.jpg" alt="なかよしルーム・プレイルーム" loading="lazy"><div><h4>なかよしルーム・プレイルーム</h4><p>未就園児の子どもたちの遊び場として、月3～5回開放しています。月曜日～金曜日の保育後は、あずかり保育の子どもたちが利用します。</p></div></article><article><img src="assets/life-map/photo11_01.jpg" alt="ツリーハウス" loading="lazy"><div><h4>ツリーハウス</h4><p>園庭の真ん中に大きなツリーハウス！大人気の遊び場です。</p></div></article><article><img src="assets/life-map/photo12.jpg" alt="ままごとの家" loading="lazy"><div><h4>ままごとの家</h4><p>砂場の道具でごちそう作り！</p></div></article><article><img src="assets/life-map/photo13_01.jpg" alt="砂場" loading="lazy"><div><h4>砂場</h4><p>大きな大きな砂場。ダイナミックに遊んでいます。</p></div></article><article><img src="assets/life-map/photo14.jpg" alt="昇降口" loading="lazy"><div><h4>昇降口</h4><p>年長組の下駄箱です。元気におはよう！</p></div></article><article><img src="assets/life-map/photo15.jpg" alt="WC（大人用）" loading="lazy"><div><h4>WC（大人用）</h4><p>ベビーシートを設置しています。</p></div></article><article><img src="assets/life-map/photo16.jpg" alt="ろうか（1F）" loading="lazy"><div><h4>ろうか（1F）</h4><p>ひろ～い廊下。子どもたちの遊び場としても利用します。</p></div></article><article><img src="assets/life-map/photo17.jpg" alt="ろうか（2F）" loading="lazy"><div><h4>ろうか（2F）</h4><p>杉のかおりがして、とても気持ちがいいです。</p></div></article><article><img src="assets/life-map/photo18.jpg" alt="WC（2F トイレ）" loading="lazy"><div><h4>WC（2F トイレ）</h4><p>年長組が利用するトイレです。</p></div></article><article><img src="assets/life-map/photo19.jpg" alt="階段" loading="lazy"><div><h4>階段</h4><p>ステンドグラスがキラキラ★</p></div></article></div></section></section>`;
extraContent.busRefined = `<section id="bus" class="bus-page bus-page-refined"><header class="bus-hero"><div class="bus-hero-copy"><span class="kicker">School Bus</span><h2>通園バスコース</h2><p>利用ご希望の方は、下記事項をご確認の上、お申込みください。</p></div><img src="assets/life-bus/bus_photo1_sp.jpg" alt="愛真幼稚園の通園バス" loading="lazy"></header><section class="bus-rules"><span class="bus-label">Bus Service</span><h3>通園バス運行について</h3><div class="bus-rule-grid"><article class="bus-rule-card bus-rule-safety"><span>01</span><h4>所定の乗降場所までの園児の送迎は、必ず保護者で責任を持ってください。</h4><p class="bus-rule-note">※出迎えのない場合、園児の安全のため園まで連れ帰ります。</p></article><article class="bus-rule-card"><span>02</span><h4>決められた時間を厳守してください。</h4><p>※幼稚園側も努力しますが、交通事情等に起因するバスの遅れはご了承ください。</p><p>※欠席される時は、必ず事前に園バスへご連絡ください。</p></article><article class="bus-rule-card bus-rule-fee"><span>03</span><h4>通園バス利用料</h4><strong>〖往復〗月 4,000円　〖片道〗2,000円です。</strong></article><article class="bus-rule-card"><span>04</span><h4>保護者の便乗</h4><p>園児の通園時の保護者の便乗は、固くお断りします。</p></article><article class="bus-rule-card bus-rule-wide"><span>05</span><h4>通園バス利用申込みは、原則として通年として、特別の事情のある他は途中変更はご遠慮ください。</h4><p>幼稚園としましては、幼稚園全園児のことを考慮して、バスの運行時間を極力短縮するよう心がけています。そのため、個々のお家の玄関まで回ることは出来ませんので、どうぞ、その点をご理解ください。</p><p>また、車内のマナーについては、家族でもご指導くださるようお願いします。</p></article></div></section><section class="bus-photo-section"><div class="bus-section-heading"><div><span class="bus-label">On the Way</span><h3>通園の様子</h3></div><p>毎日の通園を支える、愛真幼稚園のバスです。</p></div><div class="bus-photo-strip"><img src="assets/life-bus/bus_photo2_sp.jpg" alt="通園バスの様子" loading="lazy"><img src="assets/life-bus/bus_photo3_sp.jpg" alt="園児の通園の様子" loading="lazy"><img src="assets/life-bus/bus_photo4_sp.jpg" alt="通園バスの様子" loading="lazy"><img src="assets/life-bus/bus_photo5_sp.jpg" alt="通園バスの様子" loading="lazy"></div></section><section class="bus-routes"><span class="bus-label">Bus Routes</span><h3>通園バス運行順路</h3><p>毎年、新入園児により多少のコース変更があります。 詳細は園へお問い合わせください。</p><div class="bus-route-grid"><figure><img src="assets/life-bus/course_fig1_2023_01.png" alt="はとコースの通園バス運行順路" loading="lazy"><figcaption>はとコース</figcaption></figure><figure><img src="assets/life-bus/course_fig2_2023.png" alt="オリーブコースの通園バス運行順路" loading="lazy"><figcaption>オリーブコース</figcaption></figure></div></section></section>`;
extraContent.albumRefined = `<section id="album" class="album-page" data-cms-collection="aishin-moments"><header class="album-heading"><div><span class="kicker">Aishin Moment</span><h2>あいしんモーメント</h2><p>毎日が楽しい冒険、おどろきの発見の連続！<br>そんな姿をカメラにおさめています。</p></div><span class="album-heading-mark" aria-hidden="true">日々の記録</span></header><section class="album-archive"><label for="album-archive-select">月別アーカイブ</label><select id="album-archive-select" class="album-archive-select"><option value="all">月を選択</option><option value="2024-06">2024年6月 (10)</option><option value="2024-05">2024年5月 (4)</option><option value="2024-04">2024年4月 (5)</option><option value="2024-03">2024年3月 (1)</option><option value="2024-02">2024年2月 (1)</option><option value="2024-01">2024年1月 (2)</option><option value="2023-11">2023年11月 (2)</option><option value="2023-10">2023年10月 (2)</option><option value="2023-09">2023年9月 (2)</option><option value="2023-07">2023年7月 (2)</option><option value="2023-06">2023年6月 (4)</option><option value="2023-05">2023年5月 (6)</option><option value="2023-04">2023年4月 (4)</option><option value="2023-02">2023年2月 (1)</option><option value="2023-01">2023年1月 (4)</option><option value="2022-12">2022年12月 (3)</option><option value="2022-11">2022年11月 (2)</option><option value="2022-10">2022年10月 (3)</option><option value="2022-09">2022年9月 (7)</option><option value="2022-08">2022年8月 (1)</option><option value="2022-07">2022年7月 (1)</option><option value="2022-06">2022年6月 (6)</option><option value="2022-05">2022年5月 (7)</option><option value="2022-04">2022年4月 (6)</option><option value="2022-03">2022年3月 (4)</option><option value="2022-02">2022年2月 (10)</option><option value="2022-01">2022年1月 (2)</option><option value="2021-12">2021年12月 (9)</option><option value="2021-11">2021年11月 (12)</option><option value="2021-10">2021年10月 (4)</option><option value="2021-09">2021年9月 (12)</option><option value="2021-08">2021年8月 (1)</option><option value="2021-06">2021年6月 (2)</option><option value="2021-03">2021年3月 (2)</option><option value="2021-01">2021年1月 (2)</option><option value="2020-11">2020年11月 (3)</option><option value="2020-10">2020年10月 (1)</option><option value="2020-07">2020年7月 (2)</option><option value="2020-06">2020年6月 (1)</option><option value="2020-05">2020年5月 (1)</option><option value="2020-03">2020年3月 (2)</option><option value="2020-01">2020年1月 (2)</option><option value="2019-11">2019年11月 (1)</option><option value="2019-10">2019年10月 (1)</option><option value="2019-08">2019年8月 (2)</option><option value="2019-07">2019年7月 (1)</option><option value="2019-05">2019年5月 (1)</option><option value="2019-03">2019年3月 (1)</option><option value="2019-02">2019年2月 (1)</option><option value="2019-01">2019年1月 (3)</option><option value="2018-12">2018年12月 (6)</option></select></section><p class="album-lead">毎日が楽しい冒険、おどろきの発見の連続！<br>そんな姿をカメラにおさめています。</p><section class="album-archive-grid" aria-live="polite"><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-18">2024.06.18</time><h3 data-cms-field="title">6/17（月）-18（火） 笹取り＆笹巻き作り〖年中組〗</h3><span class="album-entry-group" data-cms-field="category">年中組</span></div></article><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-17">2024.06.17</time><h3 data-cms-field="title">6/13（木） サンマートさんによる食育指導〖年長組〗</h3><span class="album-entry-group" data-cms-field="category">年長組</span></div></article><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-13">2024.06.13</time><h3 data-cms-field="title">6/7（金）あいしんフェスティバルで販売　クッキー作り〖全学年〗</h3><span class="album-entry-group" data-cms-field="category">全学年</span></div></article><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-13">2024.06.13</time><h3 data-cms-field="title">6/5（水） 夢広場に行ってきたよ！〖年少組〗</h3><span class="album-entry-group" data-cms-field="category">年少組</span></div></article><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-13">2024.06.13</time><h3 data-cms-field="title">6/5（水） グミとりに行ったよ！〖年中組〗</h3><span class="album-entry-group" data-cms-field="category">年中組</span></div></article><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-04">2024.06.04</time><h3 data-cms-field="title">6/4（火） とある火曜日の食育活動〖年長・年少組〗</h3><span class="album-entry-group" data-cms-field="category">年長・年少組</span></div></article><article class="album-entry" data-cms-item data-month="2024-05"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>05</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-04">2024.06.04</time><h3 data-cms-field="title">5/28（火） おかずクレープを作ったよ！〖年中組〗</h3><span class="album-entry-group" data-cms-field="category">年中組</span></div></article><article class="album-entry" data-cms-item data-month="2024-05"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>05</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-04">2024.06.04</time><h3 data-cms-field="title">5/30（木） 重箱緑地にお出かけしたよ！〖年少・年中組〗</h3><span class="album-entry-group" data-cms-field="category">年少・年中組</span></div></article><article class="album-entry" data-cms-item data-month="2024-05"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>05</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-04">2024.06.04</time><h3 data-cms-field="title">5/15（水） お芋の苗植えをしたよ！〖年長組〗</h3><span class="album-entry-group" data-cms-field="category">年長組</span></div></article><article class="album-entry" data-cms-item data-month="2024-06"><div class="album-entry-media" data-cms-field="image" aria-hidden="true"><span>06</span></div><div class="album-entry-body"><time data-cms-field="date" datetime="2024-06-04">2024.06.04</time><h3 data-cms-field="title">給食の先生の食育タイム〖全学年〗</h3><span class="album-entry-group" data-cms-field="category">全学年</span></div></article></section></section>`;
extraContent.faqRefined = `<section class="faq-page"><header class="faq-heading"><div><span class="kicker">Frequently Asked Questions</span><h2>よくある質問</h2><p>入園をご検討されている保護者の方からいただく、よくある質問をまとめています。</p></div><span class="faq-heading-mark">お気軽にご相談ください。</span></header><div class="faq-list">
<article class="faq-item"><h3>あそびの保育って？放任ですか？</h3><div><p>自由に好きなことだけをして過ごす、放任の保育ではありません。子どもの意思や興味を尊重し、木・水・土など五感を使って考え、試し、挑戦できる環境を整えています。</p><p>クラス礼拝や朝の集まりで人の話を聴き、感謝することや人を愛することを学びます。絵本や集団遊びを通して、心の自由を育てています。</p></div></article>
<article class="faq-item"><h3>キリスト教のこと、よくわからないんだけど、だいじょうぶ？</h3><div><p>大丈夫です。キリスト教の教えを土台に、人としての成長を大切にしています。子どもをキリスト教徒にしたり、信仰を広めたりすることが目的ではありません。</p><p>礼拝やお祈り、賛美歌を通して、命や恵みを大切にする心を育みます。目に見えない心の教育、人間形成の基礎を大切にしています。</p></div></article>
<article class="faq-item"><h3>自然保育ってどんなことをしているの？</h3><div><p>森の散策、山登り、川遊び、たけのこ掘り、梅の収穫や味わいなど、鳥取の自然の中で活動します。自然いっぱいの園庭でも、季節の変化を五感で感じながら遊びます。</p><p>子どもが自分から気づき、考え、動くことを大切にし、職員も同じ目線で発見を分かち合います。</p></div></article>
<article class="faq-item"><h3>園庭のことを教えてほしいです。</h3><div><p>子どもが遊びたくなる秘密がたくさんある園庭です。50種類以上の木があり、実や葉を遊び道具にしたり、季節の恵みを収穫して味わったりします。畑では子どもたちが種まき、水やり、収穫を行います。</p><p>既製の遊具だけでなく、自然素材の中で好奇心や冒険心を働かせ、心と体を育てています。</p></div></article>
<article class="faq-item"><h3>お部屋では上靴ですか？</h3><div><p>一年を通して裸足で過ごします。裸足で歩くことで関節や筋肉を使い、バランス感覚を養います。足裏への刺激は脳の発達にもつながり、土踏まずの形成や疲れにくい体づくりにも役立ちます。</p></div></article>
<article class="faq-item"><h3>音楽教室はしていますか？</h3><div><p class="faq-emphasis">音楽教室はしていません。</p><p>礼拝や保育の中で歌や楽器に親しみますが、一律に楽器を教えるのではなく、子どもが自分で選び、楽しむことを大切にしています。音楽を含め、集団生活の中で多様な経験を重ねることを重視しています。</p></div></article>
<article class="faq-item"><h3>体操教室はしていますか？</h3><div><p class="faq-emphasis">体操教室はしていません。「さくらさくらんぼリズムあそび」を行っています。</p><p>先生の歌やピアノを聴きながら、這う、走る、跳ぶなどの動きを楽しみます。運動機能・感覚機能・知的な力を育み、心と体、考える力の成長につなげます。</p></div></article>
<article class="faq-item"><h3>英語教室はしていますか？</h3><div><p class="faq-emphasis">英語教室はしていません。</p><p>まずは豊かな日本語に触れることを大切にしています。遊びの中で「伝えたい」という気持ちが生まれ、絵本の読み聞かせで聴く力を育てます。年齢や子ども、クラスの様子に合わせて絵本を選び、年長児も物語を聴いて楽しみます。</p><p>ご家庭でも読み聞かせをお願いします。文字に興味をもつ前から無理に教えず、興味が出たときに支えます。文字が読めるようになってからも読み聞かせを続け、幼児期の楽しさを守ります。</p></div></article>
<article class="faq-item"><h3>テレビ・DVDの視聴はありますか？</h3><div><p>園ではテレビやDVDを見ません。限られた保育時間を成長のために使い、実際に見て、触れて、感じる体験を大切にしています。テレビのない環境だからこそ、子どもたちは自分で遊びを工夫します。</p><p class="faq-emphasis">「考える＝育ち」です。</p></div></article>
<article class="faq-item"><h3>ケガをしますか？</h3><div><p>泥、水、枝、木登り、包丁を使う調理や木工作など、さまざまな体験の中で擦り傷や切り傷を負うことがあります。子ども同士の衝突が起きることもあります。</p><p>一つひとつの行動を学びとして受け止めながら、安全を放置しているわけではありません。子どもの「やってみたい」という成長への力と、安全とのバランスを考えて見守ります。</p></div></article>
<article class="faq-item"><h3>弁当日はありますか？</h3><div><p>園外保育に出かけることが多いため、毎週火曜日がお弁当日です。ご家庭のお弁当は子どもたちにとって大きな楽しみです。</p><p>栄養や彩りを難しく考えすぎず、<strong>1. 食べやすいもの　2. 子どもたちの好きなもの</strong>を入れてください。</p></div></article>
<article class="faq-item"><h3>制服はありますか？</h3><div><p>制服はありません。着脱しやすく、体に合い、動きやすく、汚れてもよい服と運動靴で登園してください。</p></div></article>
<article class="faq-item"><h3>満３歳児もバスに乗れますか？</h3><div><p>乗車できます。長時間の乗車にならないよう、ご自宅の近くで乗降できるように年間のバスコースを作成しています。バス停についてはご相談ください。</p></div></article>
<article class="faq-item"><h3>預かり保育が利用できない日はありますか？</h3><div><p>基本的には開園日であれば利用できます。入園式、卒園式、親子遠足、運動会などの日は利用できません。また、園の判断で中止したり、早い時間のお迎えをお願いしたりする場合があります。</p><p>警報発令などで休園となった場合も、子どもたちの安全を優先して実施しません。</p></div></article>
</div><section class="faq-contact"><span class="kicker">Contact</span><h3>お問い合わせ・パンフレット資料請求</h3><p>ご相談や資料請求は、下記の連絡先からお気軽にお問い合わせください。</p><div class="faq-contact-details"><span><b>TEL</b> 0857-22-3044</span><span><b>FAX</b> 0857-22-3055</span><span><b>受付</b> 月〜金曜日 9：00〜18：00</span><span><b>休園</b> 祝日・土曜日・日曜日。その他、園長が必要と認めた日。</span></div><div class="download-placeholder faq-form-placeholder"><div><span class="policy-label">Form & Materials</span><strong>お問い合わせフォーム・パンフレット請求</strong><p>フォームと資料ダウンロードは、後日外部サービスへ接続予定です。</p></div><span class="download">後日接続</span></div></section></section>`;
extraContent.faqOriginal = `<section class="faq-page"><header class="faq-heading"><div><span class="kicker">Frequently Asked Questions</span><h2>よくある質問</h2><p>入園をご検討されている保護者の方からいただくよくある質問をまとめています。また、ご相談につきましては下記から、お気軽にお問い合わせください。</p></div><span class="faq-heading-mark">お気軽にご相談ください。</span></header><div class="faq-list"><article class="faq-item"><h3>あそびの保育って？放任ですか？</h3><div><p>いいえ、ちがいます。子どもたちが、遊んでいればいいという 自由保育ではありません。</p><p>子どもの意志や興味を尊重する保育 です。子どもたちは、木や、水や、土などに、思いっきり触れることができる環境の中で、五感を使い、精一杯考え、挑戦します。</p><p>また、クラスのみんなと一緒に、礼拝や、朝の会をします。そこで、子どもは話を聴く姿勢や、態度、何事にも感謝することの大切さ、自分を愛するように人の事も愛せる心、優しい心を、先生のお話や、絵本の読み聞かせ、集団あそびなどから感じ、学び、「心の自由」を獲得していきます。</p></div></article><article class="faq-item"><h3>キリスト教のこと、よくわからないんだけど、だいじょうぶ？</h3><div><p>だいじょうぶです。キリスト教の理念に基づく人間形成を目標とする保育です。これは子どもを クリスチャンにする とか、 キリスト教の教えをひろめる ということではありません。礼拝の中でお祈りをし、讃美歌をうたい、神様からいただいている「いのち」や「恵み」を大切にしていくことです。</p><p>見えるものではなく、見えない人間形成の基礎となるものに気を配り「根っこを育てる」教育 心の教育 を心がけています。</p></div></article><article class="faq-item"><h3>自然保育ってどんなことをしているの？</h3><div><p>人工的につくられた環境ではなく、自然の中にどんどん出かけていきます。森の中の散歩、登山、川遊びに加え、竹のこ掘り、梅とりなどの味覚がりをします。また、子どもたちが日常生活をする場所にこそ自然が必要と考え、自然に囲まれた園庭で五感を使って自然を感じ、味わいながら、思いきり遊びます。愛真幼稚園では、子どもたちが自然の中で自ら働きかけ、主体的に行動する機会を保障します。先生たちは、子どもが自分で発見する喜びを奪わないように、子どもたちと同じ目線で喜びを分かち合います。</p></div></article><article class="faq-item"><h3>園庭のことを教えてほしいです。</h3><div><p>子どもを 遊ぶ気にさせる秘密がたくさん園庭にはあります。５０種類以上の木が植えてあります。実や葉が落ちれば子どもたちの遊び道具、葉の色で季節を感じたり、果実が実れば、収穫し食べることができます。畑を園庭の中に持つことで、生長の過程を近くで感じる体験で心が育ちます。</p><p>愛真幼稚園の園庭遊具は、既製の遊具のみではありません。より本物に、自然環境に近い形で、自然物を使って再現されています。子どもたちの好奇心や冒険心が満たされる要素があり、心と身体を伸ばす仕掛けがたっぷりあります。</p></div></article><article class="faq-item"><h3>お部屋では上靴ですか？</h3><div><p>裸足で過ごします。裸足でいると靴を履いているときには、使わないような関節や筋肉を動かすことになるので、体を支えたり、移動させたりする バランス感覚 が養えるうえ、足裏への適度な刺激は 脳の活性化 にもつながります。土踏まずは、裸足で立ったり、歩いたりすることで、自然に形成されていくものです。土踏まずがしっかりしていれば、疲れにくくけがもしにくい体になります。</p></div></article><article class="faq-item"><h3>音楽教室はしていますか？</h3><div><p>していません。どうして…？</p><p>クラスの集まりの中でみんなで”讃美歌（神様にささげる歌）”やその他の歌を歌ったり、楽器に触れてあそんだりすることはしていますが、一斉に何かの楽器を指導したりすることはしていません。</p><p>幼児期は人から教えられることよりも、自分で選びしっかりと楽しむ経験をしていくことが大切です。</p><p>集団生活でないと体験できないことに十分に時間を使いたいので、音楽教室はしていません。</p></div></article><article class="faq-item"><h3>体操教室はしていますか？</h3><div><p>さくらさくらんぼリズムあそびをしています。</p><p>体操教室はしていませんが、斎藤公子氏が保育実践の中で生み出した運動である「リズムあそび」を運動あそびとして取り入れています。</p><p>「リズムあそび」とは、先生の歌やピアノを耳で聞き、そのリズムに合わせて体を動かす運動あそびです。這う、駆ける、跳ねる、などさまざまな動きを行うことで、運動神経と触覚や視覚などの感覚神経を同時に発達させ、身体だけでなく知的発達も促します。楽しみながら、心と身体、考える力など子どもたちに必要な力を育てます。</p></div></article><article class="faq-item"><h3>英語教室はしていますか？</h3><div><p>していません。どうして…？</p><p>他の言語を身につける前に、母国語である日本語をいかに豊かに使えるようになるかということに重きをおいています。</p><p>話す力はたくさんあそぶことで、伝えたいことが山のようにでき、自然と身についていきます。聞く力を育てるために本園が力を入れていることは、絵本の読み聞かせです。</p><p>その年齢、その子ども、そのクラスに合った絵本の選び方を日々研究しています。１年もたたないうちに、子どもたちは絵本の時間を楽しみに待つようになり、年長組になると、絵本から童話までしっかりと聞ける子どもに育ちます。</p><p>そのためにも、保護者の方には、家庭での絵本の読み聞かせもお願いしています。</p><p>加えて、<br>(1)興味をもつまで字を教えない。<br>(2)字に興味を持っても喜ばない。<br>(3)字が読めるようになっても絵本を読んであげてください。<br>ということも近年お願いしています。</p><p>読む力は小学校になってからで十分間に合います。子どもが字を読めるようになることで、幼児期にしか体験できない楽しみがなくなってしまうのです。そのことはまた入園をきめられてから、ゆっくりとお伝えします。</p></div></article><article class="faq-item"><h3>テレビ・DVDの視聴はありますか？</h3><div><p>世の中には、テレビ、DVDの素晴らしい機材もありますが、当園では テレビ、DVDは見せていません。園で過ごす時間は限られています。その限られた時間を育ちのために有効に使いたい！実体験こそ最大の教育効果がある！！というのが当園の考えです。テレビのない環境ではどのように遊びを工夫するか、子どもは一生懸命楽しんで考えます。しかしテレビがあると、その素晴らしい行動もストップしてしまいます。</p><p>『考える＝育ち』です。</p></div></article><article class="faq-item"><h3>ケガをしますか？</h3><div><p>園では、子どもたちが遊びをとおして、いろいろな体験をします。可能なかぎり、子どもたちの自由な好奇心を保障したいと考えています。泥で汚れたり、木の枝で服が破れたり、水でびしょ濡れになったり、木登りしたり、刃物で料理や、木工をしたりするので、切り傷などのケガをすることもあります。また、物のとり合いからケンカをし、時にはたたいてしまったり、ひっかいてしまったり、押してしまったり、などのトラブルになることもあります。ひとつひとつの行動が、育ちの教材です。しかし、それは安全を軽視しているわけではありません。子どもたちの成長したいという気持ちを認めつつ、安全面とのバランスをとって活動 していることを保護者の皆様には、ご理解いただければと思います。</p></div></article><article class="faq-item"><h3>弁当日はありますか？</h3><div><p>毎週火曜日は園外に出かけることが多いため、弁当日にしています。給食が楽しみな子どももいますが、お家の人が作ってくれた愛情たっぷりのお弁当は、子どもたちにとっては想像以上にうれしいようです。栄養バランス、色どり、など作る側としては、いろいろ考えてしまいますが、気にしないで大丈夫。</p><p>愛真幼稚園では、１ 食べやすく、２ 子どもたちの好きな物 を入れてあげてください。</p></div></article><article class="faq-item"><h3>制服はありますか？</h3><div><p>ありません。</p><p>自分で着脱しやすく、サイズが合っていて、動きやすく、汚れてもいい 衣服と運動靴で登園してください。</p></div></article><article class="faq-item"><h3>満３歳児もバスに乗れますか？</h3><div><p>はい、乗れます。</p><p>子どもたちが長時間の乗車にならないようにと、なるべくご自宅の近くまで迎えにいけるように、毎年度バスコースを作成しています。園バス停留所についてはご相談下さい。</p></div></article><article class="faq-item"><h3>預かり保育が利用できない日はありますか？</h3><div><p>基本的に開園日は行っています。また、警報等で休園の場合も行います。</p><p>ただし、入園式、卒園式、親子遠足、運動会の行事日は行っていません。</p><p>また、やむを得ず園の判断で、中止または早迎えをお願いすることもあります。</p></div></article></div><section class="faq-contact"><span class="kicker">Contact</span><h3>お問い合わせ・パンフレット資料請求</h3><p>ご相談につきましては、公式ページのお問い合わせフォームをご利用いただけます。</p><div class="faq-contact-details"><span><b>TEL</b> 0857-22-3044</span><span><b>FAX</b> 0857-22-3055</span><span><b>受付時間</b> 月～金曜日 9：00～18：00</span><span><b>休園日</b> 祝日・土曜日・日曜日。その他園長が必要と認めた日。</span></div><div class="download-placeholder faq-form-placeholder"><div><span class="policy-label">Form & Materials</span><strong>お問い合わせフォーム・パンフレット請求</strong><p>フォームと資料ダウンロードは、後日外部サービスへ接続予定です。</p></div><span class="download">後日接続</span></div></section></section>`;
extraContent.millefeuilleRefined = `<section class="millefeuille-page"><header class="millefeuille-heading"><h2>ミルフィーユ<br><span>コーラスサークル</span></h2><p>こんにちは、ミルフィーユです♪　あなたも一緒に歌のプレゼントしてみませんか？</p></header><figure class="millefeuille-hero"><img src="assets/nozomikai/millefeuille/photo1.jpg" alt="ミルフィーユ"><figcaption>子どもたちの誕生日会で、心をこめて歌を届けています。</figcaption></figure><section class="millefeuille-activity"><img src="assets/nozomikai/millefeuille/photo2.jpg" alt="ミルフィーユの活動の様子"><div><span class="kicker">Our activity</span><h3>歌を通して、子どもたちに笑顔を。</h3><p>主な活動は園の誕生日会で歌うことです。子どもたちからの「ミルフィーユさ～ん」の呼び声に導かれて、いざステージ！楽しんで歌います。</p><p>小さなお子さん連れでの参加も大歓迎です。</p></div></section><section class="millefeuille-profile"><span class="kicker">Information</span><h3>活動について</h3><dl><div><dt>練習日時</dt><dd>毎週火曜日　A.M.10：30～約1時間 <small>※夏休み他、不定に休みあり</small></dd></div><div><dt>練習場所</dt><dd>鳥取教会内</dd></div><div><dt>会費</dt><dd>月会費 800円 × 10ヶ月</dd></div></dl></section><section class="millefeuille-teacher"><div class="millefeuille-teacher-copy"><span class="kicker">Instructor</span><h3>指導者の紹介</h3><p><strong>尾前加寿子先生</strong><br>歌唱指導。元のぞみ会会員、鳥取オペラ協会理事、鳥取女性合唱団ボイストレーナーほか。</p><p><strong>岩本眞由子先生</strong><br>ピアノ演奏。元のぞみ会会員、鳥取女性合唱団ピアニストほか。</p></div><img src="assets/nozomikai/millefeuille/photo3.jpg" alt="ミルフィーユの指導者"></section><section class="nozomikai-contact millefeuille-contact"><div><span class="kicker">Contact</span><h3>活動についてのお問い合わせ</h3><p>見学・参加については、園までお気軽にご相談ください。</p></div><a href="tel:0857223044">TEL 0857-22-3044</a></section></section>`;
extraContent.millefeuilleRefined = extraContent.millefeuilleRefined.replace(
  /<section class="millefeuille-teacher">[\s\S]*?<\/section><section class="nozomikai-contact/,
  '<section class="millefeuille-teacher"><div class="millefeuille-teacher-copy"><span class="kicker">Instructor</span><h3>指導者の紹介</h3><div class="millefeuille-teacher-list"><article><span class="teacher-role">歌唱指導</span><h4>尾前加寿子先生</h4><p>元のぞみ会会員。現鳥取オペラ協会理事、鳥取女性合唱団ボイストレーナーほか。</p></article><article><span class="teacher-role">ピアノ演奏</span><h4>岩本眞由子先生</h4><p>元のぞみ会会員。鳥取女性合唱団ピアニストほか。</p></article></div></div><img src="assets/nozomikai/millefeuille/photo3.jpg" alt="ミルフィーユの指導者"></section><section class="nozomikai-contact'
);
extraContent.millefeuilleRefined = extraContent.millefeuilleRefined.replace(
  /<section class="millefeuille-teacher">[\s\S]*?<\/section><section class="nozomikai-contact/,
  '<section class="millefeuille-teacher"><header class="millefeuille-teacher-heading"><span class="kicker">Instructor</span><h3>指導者の紹介</h3></header><div class="millefeuille-teacher-layout"><article><span class="teacher-role">歌唱指導</span><h4>尾前加寿子先生</h4><p>元のぞみ会会員。現鳥取オペラ協会理事、鳥取女性合唱団ボイストレーナーほか。</p></article><article><span class="teacher-role">ピアノ演奏</span><h4>岩本眞由子先生</h4><p>元のぞみ会会員。鳥取女性合唱団ピアニストほか。</p></article><img src="assets/nozomikai/millefeuille/photo3.jpg" alt="ミルフィーユの指導者"></div></section><section class="nozomikai-contact'
);
extraContent.candyRefined = `<section class="candy-page"><header class="candy-heading"><h2>キャンディ<br><span>手作りサークル</span></h2><p>かわいい布雑貨やお菓子づくりなど、いろいろな手作りを楽しむサークルです。</p></header><figure class="candy-hero"><img src="assets/nozomikai/candy/photo1.jpg" alt="キャンディ"><figcaption>手作りサークル「キャンディ」の活動</figcaption></figure><section class="candy-intro"><h3>手作りサークル 「キャンディ」です。</h3><p>かわいい布雑貨を作ってみたい！ お菓子を作りたい！<br>いろいろな手作りに一緒にチャレンジしませんか？</p></section><section class="candy-activity"><img src="assets/nozomikai/candy/photo2.jpg" alt="キャンディ会員の作品"><div><span class="kicker">Our activity</span><h3>手を動かしながら、楽しい時間を。</h3><p>昨年度は、コサージュ作り・リボンレイ・手作りマスク・クリスマスリース、もちろんお料理にお菓子も楽しみました。</p><p>少しくらいゆがんでも、失敗したって大丈夫♪♪ みんなでわいわいおしゃべりしながら、の〜んびりと楽しい時間をすごしましょう。</p></div></section><section class="candy-profile"><span class="kicker">Information</span><h3>活動内容</h3><dl><div><dt>活動日時</dt><dd>毎月第２金曜日 <small>場合により変更することもあります</small><br>10：00〜12：00頃</dd></div><div><dt>活動場所</dt><dd>幼稚園２階　保護者の部屋</dd></div><div><dt>会費</dt><dd>----</dd></div></dl></section></section>`;
extraContent.oliveRefined = `<section class="olive-page candy-page"><header class="candy-heading"><h2>オリーブ<br><span>バドミントンサークル</span></h2><p>愛真幼稚園の在園児ならびに卒園児の保護者で構成するバドミントンサークルです。</p></header><figure class="candy-hero"><img src="assets/nozomikai/olive/photo1.jpg" alt="オリーブ"><figcaption>オリーブの活動</figcaption></figure><section class="candy-intro"><h3>♪「楽しい仲間」といい汗流しませんか♪</h3><p>オリーブは愛真幼稚園の在園児ならびに<br>卒園児の保護者で構成するバドミントンサークルです。</p></section><section class="candy-activity"><img src="assets/nozomikai/olive/photo2.jpg" alt="オリーブ活動の様子"><div><span class="kicker">Our activity</span><h3>体を動かして、気持ちよくリフレッシュ。</h3><p>週１回市内の体育館で活動しています。家事に育児に忙しい毎日ですが、わたしたちと一緒に楽しく体を動かしてリフレッシュしませんか？</p><p>合間のおしゃべりも楽しいですよ。メンバーの大半は初心者で、運動神経のない人もいます。</p><p>見学、体験をご希望される方は活動日に直接体育館においでください。</p></div></section><section class="candy-profile"><span class="kicker">Information</span><h3>活動内容</h3><dl><div><dt>活動日時</dt><dd>週１回　火曜日 <small>場合により変更となることもあります</small><br>10：00〜12：00</dd></div><div><dt>活動場所</dt><dd>市内の体育館</dd></div><div><dt>会費</dt><dd>--------------</dd></div></dl></section></section>`;
extraContent.sorairoRefined = `<section class="sorairo-page candy-page"><header class="candy-heading"><h2>そらいろのたね<br><span>卒園児保護者の自主活動</span></h2><p>卒業してからも幼稚園に来たいね、という声で誕生した自主活動グループです。</p></header><figure class="candy-hero"><img src="assets/nozomikai/sorairo/photo1.jpg" alt="そらいろのたね"><figcaption>そらいろのたねの活動</figcaption></figure><section class="candy-intro"><h3>卒業児保護者のあつまりです。</h3><p>「卒業してからも幼稚園に来たいね！」という声で誕生したのが、<br>卒業児保護者の自主活動グループ「そらいろのたね」（通称そらたね）です。</p></section><section class="candy-activity sorairo-activity"><div><span class="kicker">Our activity</span><h3>月に一度、いろいろな活動を楽しんでいます。</h3><p>昨年度は５月のソフトバレーに始まり、バーベキュー、ビーズ教室、ネイルアート教室などを行いました。</p><p>いつでも誰でも気軽に参加でき、やりたいことができる「そらいろのたね」にあなたも参加してみませんか？</p><p>参加をご希望の方は愛真幼稚園にお問い合わせください。</p></div></section><section class="candy-profile"><span class="kicker">Information</span><h3>活動内容</h3><dl><div><dt>活動日時</dt><dd>月１回　木曜日 <small>場合により変更となることもあります</small></dd></div><div><dt>練習場所</dt><dd>--------------</dd></div><div><dt>会費</dt><dd>--------------</dd></div></dl></section></section>`;
extraContent.tomsawyerRefined = `<section class="tomsawyer-page candy-page"><header class="candy-heading"><h2>トムソーヤパパの会<br><span>父親同士の活動</span></h2><p>父親がまず子どもと遊ぶことを楽しみ、子どもたちと一緒に過ごす会です。</p></header><figure class="candy-hero"><img src="assets/nozomikai/tomsawyer/photo1.jpg" alt="トムソーヤパパの会"><figcaption>トムソーヤパパの会の活動</figcaption></figure><section class="candy-intro"><h3>父親がまず子供と遊ぶことを楽しむ！</h3><p>難しいこと・めんどくさいことなど、うんぬんかんぬん…はありません。<br>父親同士の新しい友達と、ただいつもとは少しだけ違った立場で<br>こどもたちと遊ぶだけなんです。</p></section><section class="tomsawyer-panel"><span class="kicker">Purpose</span><h3>会の目的</h3><dl><div><dt>父親がまず子供と遊ぶことを楽しむ</dt><dd>遊ぶことで育児への積極的参加と情報交換</dd></div><div><dt>子供たち皆のパパになること</dt><dd>自分の子供だけに注目しないこと</dd></div><div><dt>みんなでカッコイイパパになろう</dt><dd>カッコイイパパってどんなことなのか</dd></div></dl></section><section class="tomsawyer-panel"><span class="kicker">Our activity</span><h3>活動内容</h3><dl><div><dt>園庭での手作りバーベキュー</dt><dd>一品持ち寄りの交流会をビール片手にやります。もちろん子どもたちも一緒に遊び楽しみましょう。</dd></div><div><dt>バザー</dt><dd>【トムソーヤパパセット】と釘打っての男の手料理？を子どもたちに。</dd></div><div><dt>あいしんまつり</dt><dd>フランクフルトにかき氷づくり！花火しにも変身します。</dd></div></dl><p class="tomsawyer-note">難しいこと、面倒臭いことなど、うんぬんかん・・はありません！<br>父親通しの新しい友だちとただいつもと少し違った立場で子どもたちと遊ぶだけ！<br>活動について希望があれば、その都度、園に申し出てください。</p></section></section>`;
extraContent.libraryRefined = `<section class="library-page candy-page"><header class="candy-heading"><h2>のぞみ会図書<br><span>保護者のための図書コーナー</span></h2><p>料理の本、子育ての本、雑誌など、保護者の方々が自由に借りられる本がそろっています。</p></header><figure class="candy-hero"><img src="assets/nozomikai/library/photo1.jpg" alt="のぞみ会図書"><figcaption>のぞみ会図書</figcaption></figure><section class="candy-intro library-intro"><h3>保護者の方々が自由に借りられる本がたくさんそろっています。</h3><p>料理の本、子育ての本、雑誌など、暮らしや子育てに役立つ本をそろえています。</p></section></section>`;
extraContent.playroomRefined = `<section class="playroom-page"><header class="playroom-heading"><div><span class="kicker">Child Support</span><h2>プレイルーム</h2><p>未就園児、0～3歳児親子体験</p></div><img src="assets/playroom/obj1.png" alt="プレイルーム"></header><figure class="playroom-hero"><img src="assets/playroom/photo1.jpg" alt="未就園児プレイルーム"></figure><section class="playroom-intro"><h3>園の生活を間近に見ながら、五感を通して育つ生活を親子で体験してみませんか？</h3><p>就園中、未就園を問わず０～３歳の親子が楽しく過ごせます。子育て中の親子同士で、交流したり、おしゃべりしながら親子で一緒に遊ぶ楽しさを味わいましょう。</p><p>園の施設を開放して専任の教師が担当しています。育児で困っていること、わからないことがあれば、気軽にご相談下さい。幼稚園の雰囲気もよく分かるとご好評いただいています。</p></section><nav class="playroom-nav" aria-label="プレイルームページ内案内"><a href="#playroom-howto">どんなことするの？</a><a href="#playroom-info">ご利用案内</a><a href="#playroom-calendar">開催日</a><a href="#playroom-reservation">ご利用予約はこちら</a></nav><figure class="playroom-wide-photo"><img src="assets/playroom/photo2.jpg" alt="プレイルームの様子"></figure><section class="playroom-howto" id="playroom-howto"><div class="playroom-section-heading"><span class="kicker">What We Do</span><h3>プレイルームってどんなことをするの？</h3></div><div class="playroom-activity-list"><article><img src="assets/playroom/obj3.png" alt="好きな遊びをいっぱいします"><div><h4>好きな遊びをいっぱいします。</h4><p>粘土・積み木・お絵描き・パズル・絵本・ままごとなど、いろいろな遊びを楽しみましょう。</p></div></article><article><img src="assets/playroom/obj4.png" alt="絵本の読み聞かせ・わらべうた・集団遊び"><div><h4>絵本の読み聞かせ・わらべうた・集団遊びをします。</h4><p>遊びを通して、お母さんとしっかり密着できる時間が子どもは大好きです。子どもにとって安心できる関係、ホッとする関係を作ることが大切です。</p></div></article><article><img src="assets/playroom/obj5.png" alt="園庭でおもいっきり遊びます"><div><h4>園庭でおもいっきり遊びます。</h4><p>自然豊かな園庭で季節を感じながら、虫とり、ツリーハウス、大きな砂場、水遊び、池などでたっぷり体を動かして遊びましょう。</p></div></article><article><img src="assets/playroom/obj12.png" alt="おたのしみイベントもあります"><div><h4>おたのしみイベントもあります。</h4><p>おたのしみスープデイ、外部の講師による楽しいイベントもあります。いつでもご連絡ください。</p></div></article><article><img src="assets/playroom/obj7.png" alt="お弁当も食べられます"><div><h4>お弁当も食べられます。<small>11：30～13：00の間に自由にとっていただいて構いません。</small></h4><p>親子で一緒に食べるゆったりとした時間をお楽しみください。プレイルームの部屋とウッドデッキを開放しています。<br>※中止になる場合がありますので園にお問い合わせ下さい。</p></div></article></div></section><section class="playroom-info" id="playroom-info"><div class="playroom-section-heading"><span class="kicker">Information</span><h3>ご利用案内</h3></div><h4>プレイルームにあそびにきませんか？</h4><p>就園されているお子様も未就園のお子様も一緒に楽しく過ごせます。幼稚園の雰囲気もよく分かるとご好評頂いています。</p><dl><div><dt>対象</dt><dd>未就園親子または0～3歳児親子</dd></div><div><dt>期間</dt><dd>4月～翌年3月（開催日は下記にあるカレンダーをご覧ください）</dd></div><div><dt>参加費</dt><dd>100円（おやつ代など）</dd></div><div><dt>場所</dt><dd>愛真幼稚園2Fプレイルーム、園庭</dd></div><div><dt>持ち物</dt><dd>水筒、手拭きタオル、着替え、プール時は水着<br><small>保護者の方も動きやすい服装でいらしてください。</small></dd></div><div><dt>時間</dt><dd>10：00～11：30／11：30～13：00<br><small>自由に昼食をとっていただいても構いません。</small></dd></div></dl><img class="playroom-info-art" src="assets/playroom/obj9.png" alt="ご利用案内"></section><section class="playroom-calendar" id="playroom-calendar"><div class="playroom-section-heading"><span class="kicker">Calendar</span><h3>プレイルーム開催日</h3></div><div class="playroom-placeholder"><strong>開催日はカレンダーからご確認ください。</strong><p>カレンダーは新しいウィンドウで開く外部サービスです。現在は接続準備中です。</p><span>開催日カレンダー：後日外部サービス接続予定</span></div></section><section class="playroom-reservation" id="playroom-reservation"><div class="playroom-section-heading"><span class="kicker">Reservation</span><h3>プレイルームご利用予約はこちら</h3></div><div class="playroom-reservation-card"><h4>プレイルームのご利用には、事前に予約が必要です。</h4><p>お電話、またはお問い合わせフォームからご予約ください。<br><strong>※ご連絡の際にアレルギーの有無をお知らせください。</strong></p><div class="playroom-contact-options"><div><b>電話で予約</b><a href="tel:0857223044">0857-22-3044</a><small>受付時間　月～金　9：00～18：00</small></div><div><b>ホームページから予約</b><strong>お問い合わせフォーム</strong><small>後日外部サービス接続予定</small></div></div><p class="playroom-contact-note">ご予約はメール、InstagramのDMでも受け付けています。メール予約・お問い合わせフォームは後日外部サービスへ接続予定です。<br><a href="https://www.instagram.com/aishin.kindergarten/" target="_blank" rel="noopener noreferrer">公式Instagramはこちら</a></p></div></section></section>`;

const fullPageMap = {
  'about.html': 'about', 'guide.html': 'guide', 'greeting.html': 'about',
  'policy.html': 'about', 'history.html': 'about', 'apply.html': 'admissions',
  'request.html': 'documents', 'information.html': 'information', 'parent.html': 'parent',
  'contact.html': 'contact', 'life.html': 'life', 'safe.html': 'life',
  'annual.html': 'life', 'schedule.html': 'life', 'lunch.html': 'life',
  'map.html': 'life', 'bus.html': 'life', 'playroom.html': 'playroom',
  'faq.html': 'faq', 'album.html': 'album', 'nozomikai.html': 'nozomikai',
  'millefeuille.html': 'nozomikai', 'candy.html': 'nozomikai', 'olive.html': 'nozomikai',
  'sorairo.html': 'nozomikai', 'tomsawyer.html': 'nozomikai',
  'nozomikai-library.html': 'nozomikai'
};
const pageMeta = {
  'about.html': ['愛真幼稚園について', 'キリスト教主義の保育と自然の中での「あそび保育」'],
  'guide.html': ['入園案内', '愛真幼稚園は、とてもたのしい幼稚園です。'],
  'admissions.html': ['見学・入園の流れ', '園の見学、ご相談、入園までのご案内'],
  'greeting.html': ['園長あいさつ', '園長 井須尚紀からのごあいさつ'],
  'policy.html': ['教育方針', '神様から与えられた幼子を大切に育てる、愛真幼稚園の教育'],
  'history.html': ['沿革', '1898年から続く愛真幼稚園の歩み'],
  'apply.html': ['募集要項', '入園までの流れ、募集人数、納付金、預かり保育'],
  'request.html': ['資料請求', 'パンフレット・募集要項などのご案内'],
  'information.html': ['情報公開', '学校法人愛真幼稚園の公開情報'],
  'parent.html': ['在園中の保護者の皆様へ', '園からのお知らせと各種書類'],
  'contact.html': ['お問い合わせ', '見学・資料請求・プレイルーム予約はこちら'],
  'documents.html': ['資料・書類', '募集要項・各種資料のご案内'],
  'class.html': ['職員・クラス・保育時間', '職員構成、クラス、保育時間のご案内'],
  'access.html': ['アクセス', '愛真幼稚園の所在地と交通案内'],
  'life.html': ['園の生活と行事', '毎日の生活、年間行事、安全と環境のご案内'],
  'safe.html': ['安全・衛生について', '子どもたちが安心して過ごすために'],
  'annual.html': ['年間行事予定', '季節ごとの行事と園外保育'],
  'schedule.html': ['一日の流れ', '愛真幼稚園で過ごす一日'],
  'lunch.html': ['給食', '旬の食材と手作りを大切にした給食'],
  'map.html': ['園内探索マップ', '木の園舎と自然いっぱいの園庭'],
  'bus.html': ['通園バスコース', '安全な通園のためのご案内'],
  'playroom.html': ['プレイルーム', '未就園児、0～3歳児親子体験'],
  'faq.html': ['よくある質問', '入園をご検討の方からのよくある質問'],
  'album.html': ['あいしんモーメント', '毎日が楽しい冒険、おどろきの発見の連続'],
  'moments.html': ['あいしんモーメント', '愛真幼稚園の日々の活動'],
  'moment-detail.html': ['笹取り＆笹巻き作り', '季節の自然と地域の食文化にふれる活動'],
  'news.html': ['園からのお知らせ', '愛真幼稚園からの最新情報'],
  'nozomikai.html': ['のぞみ会活動', '愛真幼稚園のPTA活動'],
  'millefeuille.html': ['ミルフィーユ', '歌を楽しむサークル'],
  'candy.html': ['キャンディ', '手芸・料理などの手作りサークル'],
  'olive.html': ['オリーブ', '保護者のバドミントンサークル'],
  'sorairo.html': ['そらいろのたね', '卒園児保護者との交流活動'],
  'tomsawyer.html': ['トムソーヤパパの会', '父親同士で子どもたちと遊ぶ会'],
  'nozomikai-library.html': ['のぞみ会図書', '保護者のための図書コーナー']
};

if (content && fullPageMap[page]) {
  const key = fullPageMap[page];
  const target = page === 'life.html' || page === 'playroom.html'
    ? document.querySelector('main .container')
    : document.querySelector('main .article');
  const source = page === 'greeting.html' ? extraContent.greeting : page === 'policy.html' ? extraContent.policy : page === 'apply.html' ? extraContent.admissions : page === 'safe.html' ? extraContent.safe : page === 'annual.html' ? extraContent.annual : page === 'schedule.html' ? extraContent.schedule : page === 'lunch.html' ? extraContent.lunchRefined : page === 'map.html' ? extraContent.mapRefined : page === 'bus.html' ? extraContent.busRefined : page === 'album.html' ? extraContent.albumRefined : page === 'faq.html' ? extraContent.faqOriginal : page === 'millefeuille.html' ? extraContent.millefeuilleRefined : page === 'candy.html' ? extraContent.candyRefined : page === 'olive.html' ? extraContent.oliveRefined : page === 'sorairo.html' ? extraContent.sorairoRefined : page === 'tomsawyer.html' ? extraContent.tomsawyerRefined : page === 'nozomikai-library.html' ? extraContent.libraryRefined : page === 'playroom.html' ? extraContent.playroomRefined : page === 'life.html' ? extraContent.lifeOverview : (content[key] || extraContent[key]);
  if (target && source) target.innerHTML = source;
  if (target && page === 'lunch.html') {
    const lunchHeroImage = target.querySelector('.lunch-hero-art img');
    if (lunchHeroImage) {
      lunchHeroImage.src = 'assets/life-lunch/photo1_01.jpg';
      lunchHeroImage.alt = '給食を楽しむ子どもたち';
    }
  }
  if (target && page === 'playroom.html') {
    target.querySelector('.playroom-heading>img')?.remove();
    target.querySelector('.playroom-wide-photo')?.remove();
    target.querySelectorAll('.playroom-activity-list article>img').forEach((image) => image.remove());
    target.querySelector('.playroom-info-art')?.remove();
    target.querySelector('.playroom-contact-note')?.insertAdjacentHTML('beforeend', '<br><a href="mailto:info@aishin.ed.jp">info@aishin.ed.jp</a>');
  }
  if (target && page === 'life.html') {
    const menu = target.querySelector('.life-menu');
    if (menu && !menu.querySelector('.life-menu-group')) {
      const links = [...menu.querySelectorAll(':scope > a')];
      const groups = [
        { label: '毎日の生活', note: 'Daily Life', indexes: [2, 3] },
        { label: '年間の行事', note: 'Annual Events', indexes: [1] },
        { label: '安心して過ごすために', note: 'Safety & Environment', indexes: [0, 4, 5] }
      ];
      menu.replaceChildren();
      groups.forEach((group, groupIndex) => {
        const section = document.createElement('section');
        section.className = `life-menu-group${groupIndex === 1 ? ' life-menu-group-featured' : ''}`;
        section.innerHTML = `<header><span>${group.note}</span><h3>${group.label}</h3></header><div class="life-menu-group-grid"></div>`;
        const grid = section.querySelector('.life-menu-group-grid');
        group.indexes.forEach((index) => { if (links[index]) grid.append(links[index]); });
        menu.append(section);
      });
    }
  }
  if (page === 'greeting.html' && target) {
    const heading = target.querySelector('h2');
    if (heading && !target.querySelector('.principal-name')) {
      const name = document.createElement('p');
      name.className = 'principal-name';
      name.textContent = '園長　仲程愛美';
      heading.insertAdjacentElement('afterend', name);
    }
  }
  if (page === 'guide.html' && target) {
    const guideLinks = target.querySelector('.guide-links');
    if (guideLinks) {
      ['園長あいさつ', '教育方針', '沿革', '募集要項', '職員・クラス・保育時間'].forEach((title) => {
        const card = [...guideLinks.children].find((item) => item.querySelector('h3')?.textContent.trim() === title);
        if (card) guideLinks.append(card);
      });
    }
    const staffCard = target.querySelector('.feature-disabled');
    if (staffCard) {
      staffCard.classList.remove('feature-disabled');
      staffCard.classList.add('feature-link');
      staffCard.querySelector('.tag').textContent = 'Information';
      staffCard.querySelector('.more').textContent = '詳しく見る →';
      staffCard.setAttribute('role', 'link');
      staffCard.tabIndex = 0;
      const openClassPage = () => { window.location.href = 'class.html'; };
      staffCard.addEventListener('click', openClassPage);
      staffCard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') openClassPage();
      });
    }
  }
  const sectionSets = {
    'history.html': ['#history', '#outline'],
    'safe.html': ['#safety'],
    'annual.html': ['#annual'],
    'schedule.html': ['section:first-child'],
    'lunch.html': ['#meal'],
    'map.html': ['#map'],
    'bus.html': ['#bus']
  };
  if (target && sectionSets[page]) {
    const selected = sectionSets[page].flatMap((selector) => [...target.querySelectorAll(selector)]);
    if (selected.length) target.replaceChildren(...selected);
  }
  if (target && page === 'safe.html' && !target.querySelector('.safe-page')) {
    target.querySelector('#safety')?.insertAdjacentHTML('beforeend', '<div class="life-safety-detail"><h3>災害・人災への対策</h3><p>火災・地震などに備えて、職員・園児の避難訓練を定期的に実施し、保護者への緊急連絡手段も周知します。</p><p><strong>防災設備：</strong>消火器、火災報知器、誘導灯、避難器具<br><strong>防犯対策：</strong>職員・園児への不審者対策訓練、通用口の施錠、防犯カメラの設置</p><p class="notice">警報が出るほどの荒天や感染症の蔓延予防などにより、急な休園または自由登園となる場合があります。</p></div>');
  }
  if (target && page === 'safe.html' && target.querySelector('.safe-page')) {
    const emergency = target.querySelector('.safe-page .safe-section');
    const disaster = [...target.querySelectorAll('.safe-page h3')].find((node) => node.textContent.trim() === '災害・人災への対策について')?.closest('.safe-section');
    emergency?.classList.add('safe-emphasis', 'safe-emphasis-emergency');
    disaster?.classList.add('safe-emphasis', 'safe-emphasis-disaster');
    target.querySelectorAll('.safe-illustration').forEach((image) => image.remove());
  }
  if (target && page === 'bus.html' && !target.querySelector('.bus-page-refined')) {
    target.querySelector('#bus')?.insertAdjacentHTML('beforeend', '<div class="life-bus-note"><h3>ご利用にあたって</h3><p>利用申込みは原則として通年です。特別な事情がない限り、年度途中の変更はご遠慮ください。全園児の乗車時間を短くするため、ご自宅の玄関まで回ることはできません。車内のマナーについても、ご家庭でお子様にお伝えください。</p><p>毎年、新入園児により多少のコース変更があります。詳細は園へお問い合わせください。</p></div>');
  }
  if (target && page === 'bus.html' && target.querySelector('.bus-page-refined')) {
    const allowedBusImages = ['bus_title.jpg', 'bus_photo3_sp.jpg', 'bus_photo5_sp.jpg', 'course_fig1_2023_01.png', 'course_fig2_2023.png'];
    target.querySelectorAll('.bus-page-refined img').forEach((image) => {
      if (!allowedBusImages.some((name) => image.src.endsWith(`/life-bus/${name}`))) image.closest('figure')?.remove() ?? image.remove();
    });
    const heading = target.querySelector('.bus-page-refined .bus-hero h2');
    if (heading && !target.querySelector('.bus-title-photo')) {
      const titlePhoto = document.createElement('img');
      titlePhoto.className = 'bus-title-photo';
      titlePhoto.src = 'assets/life-bus/bus_photo5_sp.jpg';
      titlePhoto.alt = '愛真幼稚園の通園バス';
      target.querySelector('.bus-page-refined .bus-hero')?.append(titlePhoto);
    }
  }
  if (target && page === 'album.html' && target.querySelector('.album-page')) {
    target.querySelector('.album-heading > div > p')?.remove();
    const albumHeading = target.querySelector('.album-heading > div');
    if (albumHeading && !albumHeading.querySelector('.album-instagram-link')) {
      const instagramLink = document.createElement('a');
      instagramLink.className = 'album-instagram-link';
      instagramLink.href = 'https://www.instagram.com/aishin.kindergarten/';
      instagramLink.target = '_blank';
      instagramLink.rel = 'noopener noreferrer';
      instagramLink.textContent = 'Instagramで愛真の日常を見る ↗';
      const instagramIcon = document.createElement('span');
      instagramIcon.className = 'instagram-icon';
      instagramIcon.setAttribute('aria-hidden', 'true');
      instagramIcon.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1.2" class="instagram-dot"></circle></svg>';
      instagramLink.prepend(instagramIcon);
      albumHeading.append(instagramLink);
    }
    const albumEntries = [...target.querySelectorAll('.album-entry')];
    albumEntries.slice(3).forEach((entry) => entry.remove());
    ['年長組', '年中組', '年少組'].forEach((group, index) => {
      const entry = albumEntries[index];
      if (!entry) return;
      entry.dataset.month = '2024-06';
      const media = entry.querySelector('.album-entry-media span');
      if (media) media.textContent = 'CMS';
      const date = entry.querySelector('time');
      if (date) date.textContent = 'CMS接続後';
      const title = entry.querySelector('[data-cms-field="title"]');
      if (title) title.textContent = '公開予定';
      const category = entry.querySelector('.album-entry-group');
      if (category) category.textContent = group;
      if (!entry.querySelector('.album-entry-note')) {
        const note = document.createElement('p');
        note.className = 'album-entry-note';
        note.textContent = 'CMS接続後に活動の様子を公開予定です。';
        entry.querySelector('.album-entry-body')?.append(note);
      }
    });
    const archiveSelect = target.querySelector('.album-archive-select');
    const archiveBar = target.querySelector('.album-archive');
    let groupSelect = target.querySelector('.album-group-select');
    if (archiveBar && !groupSelect) {
      groupSelect = document.createElement('select');
      groupSelect.className = 'album-archive-select album-group-select';
      groupSelect.setAttribute('aria-label', 'クラス別に絞り込む');
      groupSelect.innerHTML = '<option value="all">クラスを選択</option><option value="年長組">年長組</option><option value="年中組">年中組</option><option value="年少組">年少組</option><option value="りす組">りす組</option><option value="年長・年少組">年長・年少組</option><option value="全学年">全学年</option>';
      archiveBar.append(groupSelect);
    }
    const filterEntries = () => {
      const selectedMonth = archiveSelect?.value || 'all';
      const selectedGroup = groupSelect?.value || 'all';
      target.querySelectorAll('.album-entry').forEach((entry) => {
        const category = entry.querySelector('.album-entry-group')?.textContent.trim() || '';
        const monthMatch = selectedMonth === 'all' || entry.dataset.month === selectedMonth;
        const groupMatch = selectedGroup === 'all' || category.includes(selectedGroup);
        entry.hidden = !(monthMatch && groupMatch);
      });
    };
    archiveSelect?.addEventListener('change', filterEntries);
    groupSelect?.addEventListener('change', filterEntries);
  }
  if (target && page === 'nozomikai.html' && !target.querySelector('.nozomikai-page')) {
    const nozomikaiPage = target.querySelector('section');
    const grid = nozomikaiPage?.querySelector('.grid3');
    if (nozomikaiPage && grid) {
      nozomikaiPage.classList.add('nozomikai-page');
      const introParts = [...nozomikaiPage.children].filter((child) => child !== grid);
      if (introParts.length && !nozomikaiPage.querySelector('.nozomikai-heading')) {
        const intro = document.createElement('header');
        intro.className = 'nozomikai-heading';
        introParts.forEach((part) => intro.append(part));
        intro.insertAdjacentHTML('beforeend', '<span class="nozomikai-heading-mark">保護者の活動</span>');
        const meta = document.createElement('div');
        meta.className = 'nozomikai-heading-meta';
        const kicker = intro.querySelector('.kicker');
        if (kicker) kicker.innerHTML = 'PTA<br>Nozomikai';
        meta.append(kicker, intro.querySelector('.nozomikai-heading-mark'));
        intro.prepend(meta);
        nozomikaiPage.prepend(intro);
      }
      const cards = [...grid.querySelectorAll('.feature')];
      const images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg'];
      const links = ['millefeuille.html', 'candy.html', 'olive.html', 'sorairo.html', 'tomsawyer.html', 'nozomikai-library.html'];
      cards.forEach((card, index) => {
        card.classList.add('nozomikai-card');
        const image = document.createElement('img');
        image.src = 'assets/nozomikai/' + images[index];
        image.alt = card.querySelector('h3')?.textContent.trim() || 'のぞみ会活動';
        image.loading = 'lazy';
        card.prepend(image);
        card.setAttribute('role', 'link');
        card.tabIndex = 0;
        const openCard = () => { window.location.href = links[index]; };
        card.addEventListener('click', openCard);
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openCard();
          }
        });
      });
      grid.classList.add('nozomikai-grid');
      if (!nozomikaiPage.querySelector('.nozomikai-grid-heading')) {
        grid.insertAdjacentHTML('beforebegin', '<div class="nozomikai-grid-heading"><div><span>6つの活動</span><h3>のぞみ会のサークル・活動</h3></div><p>気になる活動を選んで、詳しくご覧ください。</p></div>');
      }
      grid.insertAdjacentHTML('afterend', '<section class="nozomikai-contact"><span class="kicker">Contact</span><h3>お問い合わせ・パンフレット資料請求</h3><p>のぞみ会活動についてのお問い合わせは、園までお気軽にご相談ください。</p><div><span><b>TEL</b> 0857-22-3044</span><span><b>FAX</b> 0857-22-3055</span><span><b>受付時間</b> 月～金曜日　9：00～18：00</span><span><b>休園日</b> 祝日・土曜日・日曜日。その他園長が必要と認めた日。</span></div><p class="nozomikai-form-note">お問い合わせフォームは、後日外部サービスへ接続予定です。</p></section>');
    }
  }
  if (target && page === 'millefeuille.html' && target.querySelector('.millefeuille-page')) {
    target.querySelector('.millefeuille-heading .kicker')?.remove();
    target.querySelector('.millefeuille-heading .millefeuille-parent')?.remove();
  }
  if (target && page === 'faq.html' && target.querySelector('.faq-page')) {
    const faqPage = target.querySelector('.faq-page');
    const faqList = faqPage.querySelector('.faq-list');
    const faqItems = [...faqPage.querySelectorAll('.faq-item')];
    const sessionOrder = [0, 1, 2, 5, 6, 7, 3, 4, 8, 9, 10, 11, 12, 13];
    faqItems.splice(0, faqItems.length, ...sessionOrder.map((originalIndex) => faqItems[originalIndex]));
    faqItems.forEach((item) => faqList?.append(item));
    faqItems.forEach((item, number) => {
      item.id = 'faq-question-' + (number + 1);
    });
    if (faqList && faqItems.length && !faqPage.querySelector('.faq-index')) {
      const sessionGroups = [
        { label: '保育・教育について', note: 'あそび・キリスト教・自然・各種教室', start: 0 },
        { label: '園での生活について', note: '園庭・裸足・テレビ・ケガ・お弁当・制服', start: 6 },
        { label: '入園・利用について', note: '通園バス・預かり保育', start: 12 }
      ];
      sessionGroups.forEach((session) => {
        const heading = document.createElement('div');
        heading.className = 'faq-session-heading';
        heading.innerHTML = '<span class="faq-session-line"></span><div><span>' + session.label + '</span><small>' + session.note + '</small></div>';
        faqList.insertBefore(heading, faqItems[session.start]);
      });
      const index = document.createElement('nav');
      index.className = 'faq-index';
      index.setAttribute('aria-label', 'よくある質問の目次');
      index.innerHTML = '<div class="faq-index-heading"><span class="kicker">Find your answer</span><strong>気になることから見る</strong></div><div class="faq-topic-cards"></div>';
      const cards = index.querySelector('.faq-topic-cards');
      const topics = [
        { label: '保育・教育について', note: 'あそび・キリスト教・自然・各種教室', items: [0, 1, 2, 3, 4, 5], tone: 'green' },
        { label: '園での生活について', note: '園庭・裸足・テレビ・ケガ・お弁当・制服', items: [6, 7, 8, 9, 10, 11], tone: 'amber' },
        { label: '入園・利用について', note: '通園バス・預かり保育', items: [12, 13], tone: 'blue' }
      ];
      topics.forEach((topic) => {
        const link = document.createElement('a');
        link.className = 'faq-topic-card faq-topic-' + topic.tone;
        link.href = '#' + faqItems[topic.items[0]].id;
        link.setAttribute('aria-expanded', 'false');
        link.innerHTML = '<span class="faq-topic-number">' + String(topic.items.length).padStart(2, '0') + '</span><span><b>' + topic.label + '</b><small>' + topic.note + '</small></span><i aria-hidden="true">→</i>';
        link.addEventListener('click', (event) => {
          event.preventDefault();
          faqItems.forEach((item, number) => {
            const isSelected = topic.items.includes(number);
            const button = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!button || !answer) return;
            button.setAttribute('aria-expanded', String(isSelected));
            answer.hidden = !isSelected;
            item.classList.toggle('is-open', isSelected);
          });
          cards.querySelectorAll('.faq-topic-card').forEach((card) => {
            card.classList.toggle('is-selected', card === link);
            card.setAttribute('aria-expanded', String(card === link));
          });
          const sessionHeading = faqPage.querySelectorAll('.faq-session-heading')[topics.indexOf(topic)];
          (sessionHeading || faqItems[topic.items[0]]).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        cards.append(link);
      });
      faqList.insertAdjacentElement('beforebegin', index);
    }
    faqItems.forEach((item) => {
      const heading = item.querySelector('h3');
      const answer = item.querySelector(':scope > div');
      if (!heading || !answer || heading.querySelector('.faq-question')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'faq-question';
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '<span>' + heading.textContent + '</span><b aria-hidden="true">＋</b>';
      heading.replaceChildren(button);
      answer.classList.add('faq-answer');
      answer.hidden = true;
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        answer.hidden = open;
        item.classList.toggle('is-open', !open);
      });
    });
  }
  if (target && page === 'annual.html') {
    const annualPhotoOrder = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
    target.querySelectorAll('.annual-month img').forEach((image, index) => {
      const month = annualPhotoOrder[index];
      if (month) {
        image.src = `assets/life-annual/annual_photo${month}.jpg`;
        image.alt = `${month}月の行事`;
        image.closest('.annual-month')?.classList.add(`annual-month-${month}`);
      }
    });
    const monthGrid = target.querySelector('.annual-months');
    if (monthGrid && !target.querySelector('.annual-seasons')) {
      const cards = [...monthGrid.children];
      const groups = [
        ['春の行事', cards.slice(0, 3)],
        ['夏の行事', cards.slice(3, 5)],
        ['秋の行事', cards.slice(5, 8)],
        ['冬の行事', cards.slice(8, 12)]
      ];
      const seasons = document.createElement('div');
      seasons.className = 'annual-seasons';
      groups.forEach(([label, seasonCards]) => {
        const season = document.createElement('section');
        season.className = 'annual-season';
        season.innerHTML = `<h3>${label}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'annual-season-grid';
        seasonCards.forEach((card) => grid.append(card));
        season.append(grid);
        seasons.append(season);
      });
      monthGrid.replaceWith(seasons);
    }
  }
  if (target && page === 'schedule.html') {
    const scheduleItems = [...target.querySelectorAll('.schedule-timeline .time-item')];
    const mealPhotos = scheduleItems[4]?.querySelector('.schedule-photo-pair');
    const misplacedStoryPhoto = mealPhotos?.querySelector('[data-schedule-photo="5-2"]');
    if (misplacedStoryPhoto) {
      misplacedStoryPhoto.remove();
      mealPhotos.classList.remove('schedule-photo-trio');
    }
    const returnMeetingCopy = scheduleItems[6]?.querySelector('.schedule-copy');
    const misplacedDeparturePhoto = returnMeetingCopy?.querySelector('img[src*="main_photo6_1.jpg"]')?.closest('figure');
    misplacedDeparturePhoto?.remove();
    if (returnMeetingCopy && !returnMeetingCopy.querySelector('[data-schedule-photo="5-2"]')) {
      returnMeetingCopy.querySelector('h4')?.insertAdjacentHTML('afterend', '<figure class="schedule-photo" data-schedule-photo="5-2"><img src="assets/life-schedule/main_photo5-2.jpg" alt="帰りの会で絵本やお話を楽しむ子どもたち" loading="lazy"> </figure>');
    }
    const departureCopy = scheduleItems[7]?.querySelector('.schedule-copy');
    if (departureCopy && !departureCopy.querySelector('[data-schedule-photo="6-1"]')) {
      departureCopy.querySelector('h4')?.insertAdjacentHTML('afterend', '<figure class="schedule-photo" data-schedule-photo="6-1"><img src="assets/life-schedule/main_photo6_1.jpg" alt="順次降園・バス待ちの様子" loading="lazy"> </figure>');
    }
    const snackCopy = scheduleItems[8]?.querySelector('.schedule-copy');
    if (snackCopy && !snackCopy.querySelector('[data-schedule-photo="7-1"]')) {
      snackCopy.querySelector('h4')?.insertAdjacentHTML('afterend', '<figure class="schedule-photo" data-schedule-photo="7-1"><img src="assets/life-schedule/main_photo7_1.jpg" alt="おやつの時間" loading="lazy"> </figure>');
    }
  }
  if (target && page === 'map.html') {
    const planFigures = target.querySelectorAll('.map-plan-grid figure');
    if (planFigures.length > 1) planFigures[1].remove();
    const mapNumbers = Array.from({length: 19}, (_, index) => index + 1);
    target.querySelectorAll('.map-place-grid article').forEach((card, index) => {
      const number = mapNumbers[index];
      if (!number || card.querySelector('.map-number-inline')) return;
      card.querySelector('h4')?.insertAdjacentHTML('afterbegin', `<span class="map-number-inline">${number}</span>`);
    });
  }
  const clubPages = {
    'millefeuille.html': 'ミルフィーユ', 'candy.html': 'キャンディ', 'olive.html': 'オリーブ',
    'sorairo.html': 'そらいろのたね', 'tomsawyer.html': 'トムソーヤパパの会',
    'nozomikai-library.html': 'のぞみ会図書'
  };
  if (target && clubPages[page]) {
    const heading = [...target.querySelectorAll('h3')].find((node) => node.textContent === clubPages[page]);
    const club = heading?.closest('article');
    if (club) target.replaceChildren(club);
  }
  const galleries = {
    'greeting.html': ['guide/greeting_photo2.jpg', 'guide/greeting_photo3.jpg'],
    'annual.html': ['life-annual/annual_photo1.jpg', 'life-annual/annual_photo2.jpg', 'life-annual/annual_photo3.jpg', 'life-annual/annual_photo4.jpg', 'life-annual/annual_photo5.jpg', 'life-annual/annual_photo6.jpg', 'life-annual/annual_photo7.jpg', 'life-annual/annual_photo8.jpg', 'life-annual/annual_photo9.jpg', 'life-annual/annual_photo10.jpg', 'life-annual/annual_photo11.jpg', 'life-annual/annual_photo12.jpg'],
    'schedule.html': ['life-schedule/main_photo1.jpg', 'life-schedule/main_photo2.jpg', 'life-schedule/main_photo3.jpg', 'life-schedule/main_photo4.jpg', 'life-schedule/main_photo5.jpg', 'life-schedule/main_photo6_1.jpg', 'life-schedule/main_photo7.jpg', 'life-schedule/main_photo8.jpg'],
    'lunch.html': ['life-lunch/photo1_01.jpg', 'life-lunch/photo2_01.jpg'],
    'map.html': ['life-map/map_01.png', 'life-map/map_02.webp'],
    'bus.html': ['life-bus/bus_photo1_sp.jpg', 'life-bus/bus_photo2_sp.jpg', 'life-bus/bus_photo3_sp.jpg', 'life-bus/bus_photo4_sp.jpg', 'life-bus/bus_photo5_sp.jpg', 'life-bus/course_fig1_2023_01.png', 'life-bus/course_fig2_2023.png']
  };
  galleries['schedule.html'] = [...galleries['schedule.html'], 'life-schedule/main_photo5-2.jpg', 'life-schedule/main_photo7_1.jpg'];
  if (page !== 'greeting.html' && page !== 'schedule.html' && page !== 'lunch.html' && page !== 'map.html' && page !== 'bus.html' && target && galleries[page] && !(page === 'annual.html' && target.querySelector('.annual-page'))) {
    const gallery = document.createElement('section');
    gallery.className = `photo-gallery life-gallery ${page.replace('.html', '')}`;
    const availablePhotos = ['annual.html', 'schedule.html', 'lunch.html', 'map.html', 'bus.html'].includes(page)
      ? galleries[page].map((src) => `assets/${src}`)
      : ['assets/guide_hero_01.webp', 'assets/guide_hero_sp_01.webp', 'assets/ouen_photo1.jpg', 'assets/ouen_photo2_01.jpg'];
    const photoCount = Math.min(galleries[page].length, availablePhotos.length);
    gallery.innerHTML = `<h3>写真</h3>${availablePhotos.slice(0, photoCount).map((src) => `<img src="${src}" alt="愛真幼稚園の活動写真" loading="lazy">`).join('')}`;
    target.append(gallery);
  }
  const pageImages = {
    'life.html': ['assets/ouen_photo1.jpg', '愛真幼稚園の子どもたちの園生活'],
    'playroom.html': ['assets/ouen_photo2_01.jpg', 'プレイルームの親子活動'],
    'admissions.html': ['assets/guide_hero_01.webp', '愛真幼稚園の園舎'],
    'guide.html': ['assets/guide_hero_01.webp', '愛真幼稚園の園舎'],
    'album.html': ['assets/ouen_photo1.jpg', '愛真幼稚園の子どもたち']
  };
  const image = pageImages[page];
  if (target && image && !target.querySelector('.content-photo') && page !== 'playroom.html') {
    const photo = document.createElement('img');
    photo.className = 'content-photo';
    photo.src = image[0];
    photo.alt = image[1];
    target.prepend(photo);
  }

  if (page !== 'about.html') {
    document.querySelector('.side')?.remove();
    target?.closest('.content-grid')?.classList.add('single-column');
  }
  const meta = pageMeta[page];
  if (meta) {
    const hero = document.querySelector('.page-hero');
    if (hero) {
      hero.querySelector('h1')?.replaceChildren(document.createTextNode(meta[0]));
      hero.querySelector('p')?.replaceChildren(document.createTextNode(meta[1]));
    }
    document.title = `${meta[0]}｜愛真幼稚園`;
  }
}

const currentPageMeta = pageMeta[page];
if (currentPageMeta) document.title = `${currentPageMeta[0]}｜愛真幼稚園`;

// モバイルでは、もともと左揃えの説明文だけを均等配置する。
// 中央揃え・右揃えの意図がある文章はそのまま保持する。
document.querySelectorAll('.page-hero p, main p, main li, main dd, main span, main small').forEach((copy) => {
  if (copy.children.length || copy.closest('h1, h2, h3, h4, button, a, summary')) return;
  const alignment = getComputedStyle(copy).textAlign;
  if (alignment === 'left' || alignment === 'start') copy.classList.add('balanced-copy');
});
