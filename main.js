// ==================== 全局变量和状态 ====================
const State = {
    isNavScrolled: false,
    currentSection: 'hero'
};

// ==================== DOM 元素 ====================
const elements = {
    navbar: document.querySelector('.navbar'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section'),
    projectCards: document.querySelectorAll('.project-card'),
    skillItems: document.querySelectorAll('.skill-item'),
    contactLinks: document.querySelectorAll('.contact-link'),
    fadeElements: document.querySelectorAll('.fade-in')
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeAnimations();
    initializeInteractions();
    initializeSmoothScroll();
    
    console.log('🎨 Refined Portfolio initialized');
}

// ==================== 导航栏功能 ====================
function initializeNavigation() {
    // 滚动监听
    window.addEventListener('scroll', throttle(() => {
        handleNavbarScroll();
        updateActiveSection();
    }, 100));

    // 导航链接点击
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function handleNavbarScroll() {
    const scrollTop = window.scrollY;
    
    if (scrollTop > 50 && !State.isNavScrolled) {
        elements.navbar.classList.add('scrolled');
        State.isNavScrolled = true;
    } else if (scrollTop <= 50 && State.isNavScrolled) {
        elements.navbar.classList.remove('scrolled');
        State.isNavScrolled = false;
    }
}

function updateActiveSection() {
    const scrollPosition = window.scrollY + 120;
    
    elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            if (State.currentSection !== sectionId) {
                State.currentSection = sectionId;
                updateNavLink(sectionId);
            }
        }
    });
}

function updateNavLink(activeId) {
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// ==================== 动画系统 ====================
function initializeAnimations() {
    // 初始检查
    checkFadeElements();
    
    // 滚动监听
    window.addEventListener('scroll', throttle(checkFadeElements, 100));
    
    // 为主要元素添加fade-in类
    const animatedElements = document.querySelectorAll(
        '.about-content, .project-card, .skill-section, .contact-content'
    );
    animatedElements.forEach((el, index) => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
            el.style.animationDelay = `${index * 0.1}s`;
        }
    });
}

function checkFadeElements() {
    const triggerBottom = window.innerHeight * 0.85;
    
    document.querySelectorAll('.fade-in').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('visible');
        }
    });
}

// ==================== 交互效果 ====================
function initializeInteractions() {
    // 项目卡片交互
    elements.projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 技能项目交互
    elements.skillItems.forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            skill.style.transform = 'translateX(16px)';
        });
        
        skill.addEventListener('mouseleave', () => {
            skill.style.transform = '';
        });
    });

    // 联系链接交互
    elements.contactLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-4px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });

    // 按钮交互
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ==================== 平滑滚动 ====================
function initializeSmoothScroll() {
    // 为所有锚定链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== 辅助函数 ====================

// 节流函数
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

// ==================== 页面加载完成 ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        checkFadeElements();
    }, 100);
});

// ==================== 页面可见性 ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// ==================== 控制台信息 ====================
console.log('%c🎨 CUI XP Refined Portfolio', 'font-size: 24px; font-weight: bold; color: #1a1a2e;');
console.log('%c✨ Premium Design Experience', 'font-size: 14px; color: #e94560;');
