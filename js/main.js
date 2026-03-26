// 移动端全屏菜单控制
document.querySelector('.menu-btn').addEventListener('click', function(){
  document.querySelector('.menu-overlay').classList.toggle('open');
});
document.querySelectorAll('.menu-overlay a').forEach(link=>{
  link.addEventListener('click', ()=>{
    document.querySelector('.menu-overlay').classList.remove('open');
  });
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
  const cursor = document.querySelector('.cursor');
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