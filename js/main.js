// 移动端全屏菜单控制
const menuBtn = document.querySelector('.menu-btn');
const menuOverlay = document.querySelector('.menu-overlay');

// 开场动画（轻量、可减少动效）
(function introAnimation() {
  const intro = document.querySelector('.intro');
  if (!intro) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    intro.remove();
    return;
  }

  document.body.classList.add('intro-lock');
  const minShowMs = 900;
  const start = Date.now();

  function finish() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minShowMs - elapsed);
    window.setTimeout(() => {
      intro.classList.add('intro--hide');
      document.body.classList.remove('intro-lock');
      window.setTimeout(() => intro.remove(), 850);
    }, wait);
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
    window.setTimeout(finish, 2200);
  }
})();

// subtle background parallax (mouse)
(function backgroundParallax() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let raf = 0;
  window.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);
    });
  });
})();

// Work modal
(function workModal() {
  const modal = document.querySelector('#workModal');
  if (!modal) return;

  const img = document.querySelector('#modalImg');
  const title = document.querySelector('#modalTitle');
  const meta = document.querySelector('#modalMeta');
  const desc = document.querySelector('#modalDesc');

  const data = {
    brand: {
      title: '品牌系统',
      meta: '2025 · Brand Identity',
      img: 'images/JGXFJQR.jpg',
      alt: '品牌系统',
      desc: '以秩序与极简为核心的品牌视觉系统探索：从字标、网格与色彩到应用延展，确保一致性与识别度。'
    },
    space: {
      title: '空间视觉',
      meta: '2025 · Spatial Visual',
      img: 'images/LHSGJ.jpg',
      alt: '空间视觉',
      desc: '强调材质与光影关系的空间视觉表达：通过克制的构成与细节控制，让空间呈现更安静、更有张力。'
    },
    illustration: {
      title: '插画创作',
      meta: '2026 · Illustration',
      img: 'images/XFWRJ.jpg',
      alt: '插画创作',
      desc: '以图形语言与叙事节奏为导向的插画创作：在统一的形式规则下保持情绪与故事性。'
    }
  };

  function open(key) {
    const item = data[key];
    if (!item) return;

    img.src = item.img;
    img.alt = item.alt;
    title.textContent = item.title;
    meta.textContent = item.meta;
    desc.textContent = item.desc;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.work-card[data-work]').forEach((card) => {
    card.addEventListener('click', () => open(card.getAttribute('data-work')));
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(card.getAttribute('data-work'));
      }
    });
  });

  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.matches && target.matches('[data-close]')) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();

function setMenuOpen(isOpen) {
  menuOverlay.classList.toggle('open', isOpen);
  menuBtn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

menuBtn.addEventListener('click', function () {
  setMenuOpen(!menuOverlay.classList.contains('open'));
});
document.querySelectorAll('.menu-overlay a').forEach(link=>{
  link.addEventListener('click', ()=>{
    setMenuOpen(false);
  });
});

// ESC 关闭菜单
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenuOpen(false);
});

// 平滑滚动（兼容菜单与锚点）
function smoothScroll(event) {
  const href = this.getAttribute('href');
  if (href && href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', smoothScroll);
});

// 滚动时导航栏效果
function handleScroll() {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Scroll reveal animation
function checkReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  const windowHeight = window.innerHeight;
  const revealPoint = 150;
  
  reveals.forEach(element => {
    const revealTop = element.getBoundingClientRect().top;
    if (revealTop < windowHeight - revealPoint) {
      element.classList.add('revealed');
    }
  });
}

// 图片懒加载
function lazyLoad() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.getBoundingClientRect().top < window.innerHeight) {
      img.src = img.dataset.src || img.src;
    }
  });
}

// Initial check
checkReveal();
lazyLoad();

// Check on scroll
window.addEventListener('scroll', function() {
  handleScroll();
  checkReveal();
  lazyLoad();
});

// 鼠标移动效果
function handleMouseMove(e) {
  let cursor = document.querySelector('.cursor');
  if (!cursor) {
    const newCursor = document.createElement('div');
    newCursor.className = 'cursor';
    document.body.appendChild(newCursor);
    cursor = newCursor;
  }
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
}

// 添加鼠标移动效果
// document.addEventListener('mousemove', handleMouseMove);