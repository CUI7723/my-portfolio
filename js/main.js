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

// Works section scroll animation
window.addEventListener('scroll', function() {
  const worksSection = document.querySelector('.works');
  if (worksSection) {
    const rect = worksSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll position relative to works section
    const scrollPosition = window.scrollY - rect.top;
    
    // Reset classes
    worksSection.classList.remove('scrolled', 'scrolled-more');
    
    // Add classes based on scroll position
    if (scrollPosition > windowHeight * 0.5) {
      worksSection.classList.add('scrolled');
    }
    if (scrollPosition > windowHeight * 1.5) {
      worksSection.classList.add('scrolled-more');
    }
  }
});