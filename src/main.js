/**
 * PROJECT: orbix-meter.blog
 * ENGINE: GSAP, Lenis, SplitType, Lucide
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 3. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('mobile-menu--active');
            // Анимация иконки бургера (опционально)
            burger.style.transform = isActive ? 'rotate(90deg)' : 'rotate(0deg)';
            body.style.overflow = isActive ? 'hidden' : ''; // Блокировка скролла
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('mobile-menu--active');
                burger.style.transform = 'rotate(0deg)';
                body.style.overflow = '';
            });
        });
    }

    // --- 4. GSAP АНИМАЦИИ (HERO + SCROLL) ---
    gsap.registerPlugin(ScrollTrigger);

    // Анимация заголовка Hero (без разрыва слов)
    const heroTitleElement = document.querySelector('#hero-title');
    if (heroTitleElement) {
        // Разбиваем на слова и символы. 'words' гарантирует, что слова не разорвутся.
        const text = new SplitType(heroTitleElement, { 
            types: 'words, chars',
            tagName: 'span' 
        });

        gsap.from(text.chars, {
            opacity: 0,
            y: 80,
            rotate: 15,
            scale: 0.8,
            stagger: 0.03,
            duration: 1.2,
            ease: "expo.out",
            clearProps: "all" 
        });
    }

    // Появление секций при скролле
    const revealElements = document.querySelectorAll('.section-title, .benefit-card, .blog-item, .anti-grid__item');
    revealElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Интерактив для карточек (микродвижение)
    document.querySelectorAll('.benefit-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { backgroundColor: '#262a1f', duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { backgroundColor: 'transparent', duration: 0.3 });
        });
    });

    // --- 5. ЛОГИКА ФОРМЫ (ВАЛИДАЦИЯ + КАПЧА) ---
    const form = document.getElementById('main-form');
    if (form) {
        const phoneInput = document.getElementById('phone-input');
        const captchaLabel = document.getElementById('captcha-label');
        const captchaInput = document.getElementById('captcha-input');
        const successMsg = document.getElementById('form-success');

        // Генерация капчи
        const val1 = Math.floor(Math.random() * 10) + 1;
        const val2 = Math.floor(Math.random() * 10) + 1;
        const correctSum = val1 + val2;
        
        if (captchaLabel) {
            captchaLabel.innerText = `Подтвердите, что вы не робот: ${val1} + ${val2} = ?`;
        }

        // Только цифры в телефоне
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверка капчи
            if (parseInt(captchaInput.value) !== correctSum) {
                captchaInput.style.borderColor = '#ff4b4b';
                alert('Ошибка: Неверный результат вычисления.');
                return;
            }

            // Имитация отправки
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.disabled = true;
            submitBtn.innerText = 'ОТПРАВКА...';

            setTimeout(() => {
                form.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                if (successMsg) {
                    successMsg.style.display = 'block';
                    // Скрыть через 5 секунд
                    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
                }
            }, 1500);
        });
    }

    // --- 6. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookiePopup && !localStorage.getItem('orbix_cookies_accepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'flex';
            gsap.from(cookiePopup, { y: 100, opacity: 0, duration: 0.6 });
        }, 3000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('orbix_cookies_accepted', 'true');
            gsap.to(cookiePopup, { 
                y: 100, 
                opacity: 0, 
                duration: 0.4, 
                onComplete: () => { cookiePopup.style.display = 'none'; } 
            });
        });
    }

    // --- 7. ЭФФЕКТ СКРОЛЛА ХЕДЕРА ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.padding = '12px 0';
            header.style.backgroundColor = 'rgba(26, 28, 21, 0.95)';
        } else {
            header.style.padding = '24px 0';
            header.style.backgroundColor = 'rgba(26, 28, 21, 0.9)';
        }
    });

});

console.log("%c Orbix-Meter %c System Online ", "background: #d4ff3f; color: #1a1c15; font-weight: bold;", "background: #262a1f; color: #fff;");