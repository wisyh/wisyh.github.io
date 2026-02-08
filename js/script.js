/**
 * Wisyh - 个人网站交互脚本
 * 版本: 1.0.0
 * 描述: 处理鼠标交互、导航栏滚动效果等
 * 作者: Wisyh
 */

document.addEventListener('DOMContentLoaded', function() {
    // =========================================================================
    // 初始化函数
    // =========================================================================
    
    /**
     * 初始化所有交互功能
     */
    function init() {
        initMouseEffects();
        initNavbarScroll();
        initSmoothScroll();
        console.log('Wisyh Portfolio initialized successfully.');
    }
    
    // =========================================================================
    // 鼠标交互效果
    // =========================================================================
    
    /**
     * 初始化鼠标跟随光效
     */
    function initMouseEffects() {
        const mouseElements = document.querySelectorAll('[data-mouse]');
        
        mouseElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });
            
            // 鼠标离开时重置位置
            el.addEventListener('mouseleave', () => {
                el.style.setProperty('--mouse-x', '50%');
                el.style.setProperty('--mouse-y', '50%');
            });
        });
    }
    
    // =========================================================================
    // 导航栏滚动控制
    // =========================================================================
    
    /**
     * 初始化导航栏滚动显示/隐藏逻辑
     */
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        const showThreshold = 100;
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // 显示/隐藏导航栏
            if (currentScroll > showThreshold) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
            
            // 记录最后滚动位置
            lastScrollTop = currentScroll;
        });
        
        // 初始检查
        if (window.pageYOffset > showThreshold) {
            navbar.classList.add('visible');
        }
    }
    
    // =========================================================================
    // 平滑滚动
    // =========================================================================
    
    /**
     * 初始化平滑滚动功能
     */
    function initSmoothScroll() {
        // 为所有锚点链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // =========================================================================
    // 社交功能
    // =========================================================================
    
    /**
     * 打开QQ客户端或网页版
     * @returns {void}
     */
    window.openQQ = function() {
        // 尝试打开QQ客户端
        const qqClientUrl = 'mqqapi://card/show_pslcard?uin=1447017701';
        window.location.href = qqClientUrl;
        
        // 如果客户端未安装，2秒后跳转到网页版
        setTimeout(() => {
            const qqWebUrl = 'https://user.qzone.qq.com/1447017701';
            const newWindow = window.open(qqWebUrl, '_blank');
            
            // 如果弹出窗口被拦截，重定向当前页面
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                window.location.href = qqWebUrl;
            }
        }, 2000);
    };
    
    /**
     * 复制联系方式到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('已复制到剪贴板: ' + text);
            })
            .catch(err => {
                console.error('复制失败:', err);
            });
    }
    
    // =========================================================================
    // 页面加载效果
    // =========================================================================
    
    /**
     * 页面加载完成后添加淡入效果
     */
    function initPageLoadEffects() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach((el, index) => {
            // 延迟触发动画，创建交错效果
            setTimeout(() => {
                el.style.animationDelay = `${index * 0.1}s`;
            }, 100);
        });
    }
    
    // =========================================================================
    // 执行初始化
    // =========================================================================
    
    // 页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initPageLoadEffects();
        });
    } else {
        init();
        initPageLoadEffects();
    }
    
    // =========================================================================
    // 性能优化和错误处理
    // =========================================================================
    
    // 监听图片加载错误
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('图片加载失败:', this.src);
            this.style.display = 'none';
        });
    });
    
    // 滚动性能优化
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                // 滚动停止后可以执行的操作
            }, 100);
        }
    });
});