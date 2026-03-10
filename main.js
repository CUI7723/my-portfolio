// ==================== 状态管理 ====================
const State = {
    currentScene: 'chair', // 'chair', 'transition', 'main'
    isAnimating: false
};

// ==================== 场景元素 ====================
const scenes = {
    chair: document.getElementById('chair-scene'),
    transition: document.getElementById('transition-scene'),
    main: document.getElementById('main-scene')
};

const questionText = document.getElementById('question-text');
const sitPrompt = document.querySelector('.sit-prompt');
const floatingCards = document.querySelectorAll('.floating-card');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // 绑定"坐下来"点击事件
    sitPrompt.addEventListener('click', handleSitDown);
    
    // 初始化漂浮卡片的交互效果
    initializeFloatingCards();
    
    // 开始环境粒子动画
    startAmbientAnimation();
    
    console.log('🎨 Portfolio initialized');
}

// ==================== "坐下来"交互 ====================
function handleSitDown() {
    if (State.isAnimating) return;
    State.isAnimating = true;
    
    // 隐藏椅子场景
    scenes.chair.classList.remove('active');
    
    // 显示转换动画场景
    scenes.transition.classList.add('active');
    
    // 播放坐下音效（可选，这里用视觉代替）
    playSittingSound();
    
    // 模拟坐下过程
    setTimeout(() => {
        // 隐藏转换场景
        scenes.transition.classList.remove('active');
        
        // 显示主场景
        scenes.main.classList.add('active');
        State.currentScene = 'main';
        
        // 开始主场景动画
        startMainSceneAnimation();
        
        State.isAnimating = false;
    }, 1500); // 1.5秒的转换动画
}

function playSittingSound() {
    // 这里可以添加音效，暂时留空
    // 视觉上已经通过CSS动画模拟了
}

// ==================== 主场景动画 ====================
function startMainSceneAnimation() {
    // 打字机效果显示"你想知道什么"
    typeWriterEffect("你想知道什么");
    
    // 漂浮卡片进入
    floatingCards.forEach((card, index) => {
        const delay = index * 0.5;
        card.style.animationDelay = `${delay}s`;
        
        // 添加持续漂浮动画
        startFloatingAnimation(card, index);
    });
    
    // 开始环境光晕效果
    startCursorGlow();
}

// ==================== 打字机效果 ====================
function typeWriterEffect(text) {
    let index = 0;
    const speed = 150; // 打字速度（毫秒）
    
    function type() {
        if (index < text.length) {
            questionText.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ==================== 漂浮卡片动画 ====================
function startFloatingAnimation(card, index) {
    let time = 0;
    const baseX = parseFloat(getComputedStyle(card).getPropertyValue('--x'));
    const baseY = parseFloat(getComputedStyle(card).getPropertyValue('--y'));
    
    function animate() {
        if (State.currentScene !== 'main') return;
        
        time += 0.01;
        
        // 每个卡片有不同的漂浮参数
        const amplitude = 10 + (index % 3) * 5; // 振幅
        const speed = 0.5 + (index % 2) * 0.3; // 速度
        
        const offsetX = Math.sin(time * speed) * amplitude;
        const offsetY = Math.cos(time * speed * 0.7) * amplitude;
        
        const currentX = baseX + offsetX;
        const currentY = baseY + offsetY;
        
        card.style.setProperty('--x', `${currentX}px`);
        card.style.setProperty('--y', `${currentY}px`);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==================== 卡片交互效果 ====================
function initializeFloatingCards() {
    floatingCards.forEach((card, index) => {
        // 鼠标移入：暂停漂浮，放大，高亮
        card.addEventListener('mouseenter', () => {
            card.style.animationPlayState = 'paused';
            card.style.zIndex = '100';
        });
        
        // 鼠标移出：恢复漂浮
        card.addEventListener('mouseleave', () => {
            card.style.animationPlayState = 'running';
            card.style.zIndex = '10';
        });
        
        // 鼠标跟随效果
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 卡片3D倾斜效果
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translate(var(--x), var(--y)) 
                scale(1.05) 
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
        
        // 点击卡片时的反馈
        card.addEventListener('click', () => {
            // 创建点击波纹效果
            createRipple(card);
            
            // 添加一个"弹跳"效果
            card.style.transform = `
                translate(var(--x), var(--y)) 
                scale(0.95)
            `;
            
            setTimeout(() => {
                card.style.transform = `
                    translate(var(--x), var(--y)) 
                    scale(1.05)
                `;
            }, 150);
        });
    });
}

// ==================== 点击波纹效果 ====================
function createRipple(card) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple-expand 0.6s ease-out forwards;
    `;
    
    card.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 添加波纹动画
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-expand {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// ==================== 鼠标光晕效果 ====================
let cursorGlow;
let mouseX = 0;
let mouseY = 0;

function startCursorGlow() {
    // 创建鼠标跟随光晕
    cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow-main';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
    `;
    document.body.appendChild(cursorGlow);
    
    // 鼠标移动跟踪
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 鼠标进入文档
    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '0.5';
    }, true);
    
    // 鼠标离开文档
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    }, true);
    
    // 动画循环
    animateGlow();
}

function animateGlow() {
    if (cursorGlow) {
        let glowX = parseFloat(cursorGlow.style.left) || 0;
        let glowY = parseFloat(cursorGlow.style.top) || 0;
        
        // 平滑跟随
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
    }
    
    requestAnimationFrame(animateGlow);
}

// ==================== 环境动画 ====================
function startAmbientAnimation() {
    // 背景渐变动画
    let hue = 230;
    const body = document.body;
    
    setInterval(() => {
        hue = (hue + 0.1) % 360;
        body.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 30}, 70%, 60%) 100%)`;
    }, 50);
}

// ==================== 技能标签点击效果 ====================
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('click', function() {
        // 创建弹跳效果
        this.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        this.style.transform = 'translateY(-10px) scale(1.2)';
        
        // 随机改变颜色
        const colors = ['#FF6B35', '#667eea', '#764ba2', '#FFD93D', '#00D9A3'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.style.background = randomColor;
        
        setTimeout(() => {
            this.style.transform = 'translateY(0) scale(1)';
        }, 200);
    });
});

// ==================== 联系链接悬停效果 ====================
const contactLinks = document.querySelectorAll('.contact-link');
contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        // 创建一个"飘出"的效果
        this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        this.style.transform = 'translateY(-5px) scale(1.05)';
        
        // 添加闪烁效果
        const icon = this.querySelector('span');
        icon.style.animation = 'icon-shake 0.5s ease infinite';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        
        // 停止闪烁
        const icon = this.querySelector('span');
        icon.style.animation = '';
    });
});

// 添加图标摇晃动画
const iconStyle = document.createElement('style');
iconStyle.textContent = `
    @keyframes icon-shake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
`;
document.head.appendChild(iconStyle);

// ==================== 性能优化 ====================
// 使用节流函数优化鼠标移动事件
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

// 节流鼠标移动事件
document.addEventListener('mousemove', throttle((e) => {
    // 这里可以添加其他需要节流的鼠标事件处理
}, 50));

// ==================== 页面可见性检测 ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时，暂停动画
        if (cursorGlow) {
            cursorGlow.style.opacity = '0';
        }
    } else {
        // 页面显示时，恢复动画
        if (cursorGlow && State.currentScene === 'main') {
            cursorGlow.style.opacity = '0.5';
        }
    }
});

// ==================== 控制台彩蛋 ====================
console.log('%c🎨 CUI XP Portfolio', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
console.log('%c✨ Interactive Experience', 'font-size: 14px; color: #667eea;');
console.log('%c💡 提示：点击"坐下来"开始探索', 'font-size: 12px; color: #86868B;');