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

// Initial check
checkReveal();

// Check on scroll
window.addEventListener('scroll', checkReveal);