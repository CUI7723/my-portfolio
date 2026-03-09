// ==================== 鼠标跟随光晕效果 ====================
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
}

animateGlow();

// 显示光晕效果
document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
}, true);

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
}, true);

// ==================== 项目卡片鼠标跟踪效果 ====================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    });
});

// ==================== 平滑滚动 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== 导航栏滚动效果 ====================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // 添加/移除滚动状态
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==================== 滚动动画 ====================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 为所有带有fade-in-up类的元素添加动画
document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

// ==================== 滚动进度指示器 ====================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #0071E3, #5E5CE6);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ==================== 按钮磁吸效果 ====================
const magneticButtons = document.querySelectorAll('.cta-button');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ==================== 平滑进入动画 ====================
const animateOnLoad = () => {
    const animatedElements = document.querySelectorAll('.animate-text');

    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + index * 150);
    });
};

// 页面加载完成后执行
window.addEventListener('load', animateOnLoad);

// ==================== 技能标签点击反馈 ====================
const skillTags = document.querySelectorAll('.skills-tags span, .project-tags span');

skillTags.forEach(tag => {
    tag.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// ==================== 导航链接激活状态 ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== 页面可见性检测 ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cursorGlow.style.display = 'none';
    } else {
        cursorGlow.style.display = 'block';
    }
});

// ==================== 性能优化：节流函数 ====================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 使用节流优化滚动事件
const throttledScroll = throttle(() => {
    // 可以在这里添加其他滚动相关的优化逻辑
}, 100);

window.addEventListener('scroll', throttledScroll);

console.log('🎨 Portfolio website loaded successfully!');
console.log('📱 Designed with Apple-style aesthetics');
console.log('✨ Interactive elements initialized');

// 文字躲避鼠标设计
const heroTitle = document.querySelector('.hero-title');
const titleSpans = heroTitle.innerText.split('').map(char => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    return span;
});

heroTitle.innerHTML = '';
titleSpans.forEach(span => heroTitle.appendChild(span));

heroTitle.addEventListener('mousemove', (e) => {
    titleSpans.forEach(span => {
        const rect = span.getBoundingClientRect();
        const spanCenterX = rect.left + rect.width / 2;
        const spanCenterY = rect.top + rect.height / 2;
        
        const dist = Math.sqrt(
            Math.pow(e.clientX - spanCenterX, 2) + 
            Math.pow(e.clientY - spanCenterY, 2)
        );
        
        if (dist < 100) {
            const angle = Math.atan2(e.clientY - spanCenterY, e.clientX - spanCenterX);
            const force = (100 - dist) / 10;
            const offsetX = Math.cos(angle) * force;
            const offsetY = Math.sin(angle) * force;
            
            span.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        } else {
            span.style.transform = 'translate(0, 0)';
        }
    });
});

heroTitle.addEventListener('mouseleave', () => {
    titleSpans.forEach(span => {
        span.style.transform = 'translate(0, 0)';
    });
});

// logo彩蛋设计
const logo = document.querySelector('.logo');
let logoClickCount = 0;
const requiredClicks = 5;

logo.addEventListener('click', (e) => {
    logoClickCount++;
    
    if (logoClickCount >= requiredClicks) {
        logoClickCount = 0;
        triggerEasterEgg();
    }
});

function triggerEasterEgg() {
    // 创建一些彩色粒子从Logo爆炸出来
    for (let i = 0; i < 20; i++) {
        createParticle(logo);
    }
    
    // 显示一条有趣的消息
    const message = document.createElement('div');
    message.textContent = '🎉 你发现我了！';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px 40px;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 10000;
        animation: pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fade 0.3s ease forwards';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

function createParticle(element) {
    const particle = document.createElement('div');
    const colors = ['#667eea', '#764ba2', '#FF6B35', '#FFD93D', '#00D9A3'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        top: ${element.getBoundingClientRect().top + element.offsetHeight / 2}px;
        left: ${element.getBoundingClientRect().left + element.offsetWidth / 2}px;
    `;
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 300 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let x = 0, y = 0;
    let opacity = 1;
    
    function animate() {
        x += vx * 0.016;
        y += vy * 0.016 + 5; // 添加重力
        opacity -= 0.02;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    requestAnimationFrame(animate);
}