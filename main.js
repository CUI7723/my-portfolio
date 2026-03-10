// ==================== 全局变量和状态 ====================
const State = {
    isNavScrolled: false,
    currentSection: 'hero',
    formSubmitted: false
};

// ==================== DOM 元素 ====================
const elements = {
    navbar: document.querySelector('.navbar'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section'),
    fadeElements: document.querySelectorAll('.fade-in'),
    contactForm: document.querySelector('.contact-form'),
    projectCards: document.querySelectorAll('.project-card'),
    skillItems: document.querySelectorAll('.skill-item')
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeInteractions();
    initializeForm();
    initializeSmoothScroll();
    initializeParallax();
    
    console.log('🎨 Redesigned Portfolio initialized');
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
    const scrollPosition = window.scrollY + 100;
    
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

// ==================== 滚动动画 ====================
function initializeScrollAnimations() {
    // 初始检查
    checkFadeElements();
    
    // 滚动监听
    window.addEventListener('scroll', throttle(checkFadeElements, 100));
    
    // 为所有section添加fade-in类
    document.querySelectorAll('section > .container > *, section > *').forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
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
    elements.projectCards.forEach((card, index) => {
        // 悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // 点击效果
        card.addEventListener('click', () => {
            createRipple(card);
            // 这里可以添加打开项目详情的功能
        });
        
        // 设置动画延迟
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // 技能项目交互
    elements.skillItems.forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            const icon = skill.querySelector('.skill-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        skill.addEventListener('mouseleave', () => {
            const icon = skill.querySelector('.skill-icon');
            icon.style.transform = '';
        });
    });

    // 按钮交互
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            createGlowEffect(btn);
        });
        
        btn.addEventListener('mouseleave', () => {
            removeGlowEffect(btn);
        });
    });
}

// ==================== 表单功能 ====================
function initializeForm() {
    if (!elements.contactForm) return;

    const form = elements.contactForm;
    const inputs = form.querySelectorAll('input, textarea');

    // 输入框焦点效果
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });

        // 实时验证
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });

    // 表单提交
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm(form);
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    
    // 移除之前的错误状态
    input.classList.remove('error');
    removeErrorMessage(input);
    
    // 基础验证
    if (value === '') {
        return true; // 空值在提交时验证
    }
    
    // 邮箱验证
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showErrorMessage(input, '请输入有效的邮箱地址');
            input.classList.add('error');
            return false;
        }
    }
    
    return true;
}

function validateForm() {
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        if (value === '') {
            showErrorMessage(input, '此字段不能为空');
            input.classList.add('error');
            isValid = false;
        } else {
            isValid = validateInput(input) && isValid;
        }
    });
    
    return isValid;
}

function showErrorMessage(input, message) {
    // 移除现有的错误消息
    removeErrorMessage(input);
    
    // 创建新的错误消息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.parentElement.appendChild(errorDiv);
    
    // 添加样式（如果还没有）
    if (!document.querySelector('#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-message {
                color: #FF6B35;
                font-size: 0.875rem;
                margin-top: 8px;
                animation: slideDown 0.3s ease;
            }
            
            input.error, textarea.error {
                border-color: #FF6B35 !important;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeErrorMessage(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function submitForm(form) {
    if (State.formSubmitted) return;
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = '发送中...';
    
    // 模拟表单提交
    setTimeout(() => {
        btn.textContent = '发送成功！';
        btn.style.background = 'linear-gradient(135deg, #00D9A3 0%, #00B686 100%)';
        
        // 重置表单
        form.reset();
        State.formSubmitted = true;
        
        // 3秒后恢复按钮
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
            State.formSubmitted = false;
        }, 3000);
        
        // 显示成功消息
        showSuccessMessage();
    }, 1500);
}

function showSuccessMessage() {
    // 创建成功提示
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.innerHTML = `
        <div class="success-icon">✓</div>
        <div class="success-text">消息已发送，我会尽快回复！</div>
    `;
    
    // 添加样式
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .success-toast {
                position: fixed;
                top: 100px;
                right: 24px;
                background: white;
                padding: 20px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 9999;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
            }
            
            .success-icon {
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #00D9A3 0%, #00B686 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            
            .success-text {
                color: var(--text-primary);
                font-weight: 500;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successDiv);
    
    // 5秒后移除
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
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

// ==================== 视差效果 ====================
function initializeParallax() {
    // 为英雄区域的形状添加视差效果
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
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

// 创建波纹效果
function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    // 动画完成后移除
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // 添加波纹动画样式
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .ripple {
                position: absolute;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 创建发光效果
function createGlowEffect(element) {
    element.style.boxShadow = '0 8px 24px rgba(22, 93, 255, 0.3)';
}

function removeGlowEffect(element) {
    element.style.boxShadow = '';
}

// ==================== 页面可见性 ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
        // 可以在这里暂停一些动画
    } else {
        console.log('Page visible - resuming animations');
        // 可以在这里恢复动画
    }
});

// ==================== 加载完成 ====================
window.addEventListener('load', () => {
    // 确保所有元素都已加载
    setTimeout(() => {
        checkFadeElements();
    }, 100);
});

// ==================== 控制台信息 ====================
console.log('%c🎨 CUI XP Redesigned Portfolio', 'font-size: 24px; font-weight: bold; color: #165DFF;');
console.log('%c✨ Modern Interactive Experience', 'font-size: 14px; color: #7B61FF;');
console.log('%c💡 Features:', 'font-size: 12px; color: #86868B;');
console.log('   • Smooth scrolling navigation');
console.log('   • Fade-in scroll animations');
console.log('   • Interactive cards with hover effects');
console.log('   • Form validation and submission');
console.log('   • Parallax effects in hero section');
