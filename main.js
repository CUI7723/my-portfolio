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
document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click', smoothScroll);
});

// section/Works reveal 动画（滚动进入时浮现）
function revealOnScroll(){
  const nodes = document.querySelectorAll('.reveal-on-scroll, .work-card');
  const windowHeight = window.innerHeight;
  nodes.forEach(node=>{
    const rect = node.getBoundingClientRect();
    if(rect.top < windowHeight - 80) node.classList.add('visible','active');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', () => { setTimeout(revealOnScroll, 90); });
