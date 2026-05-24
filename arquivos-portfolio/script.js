// ===== SCROLL LOCK BLINDADO (MENU + MODAL) =====
let __scrollLocks = 0;
let __scrollY = 0;

function lockScroll() {
    __scrollLocks++;

    if (__scrollLocks > 1) return;

    __scrollY = window.scrollY || window.pageYOffset || 0;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${__scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
}

function unlockScroll() {
    if (__scrollLocks <= 0) return;
    __scrollLocks--;

    if (__scrollLocks > 0) return;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    window.scrollTo(0, __scrollY);
}

// ===== INTERSECTION OBSERVER PARA ANIMAÇÕES =====
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

animatedElements.forEach(el => observer.observe(el));

// ===== SCROLL UNIFICADO COM REQUESTANIMATIONFRAME =====
const header = document.querySelector('header');
const progressBar = document.getElementById('progressBar');
const backToTopBtn = document.getElementById('backToTop');

let ticking = false;

function handleScroll() {
    const y = window.scrollY || window.pageYOffset;

    header.classList.toggle('scrolled', y > 50);
    backToTopBtn.classList.toggle('show', y > 500);

    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? y / height : 0;

    progressBar.style.transform = `scaleX(${scrolled})`;
    progressBar.style.opacity = scrolled > 0.05 ? '1' : '0.5';

    updateActiveLink();
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
}, { passive: true });

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
        }
    });

    mobileLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
        }
    });
}

// Mobile menu corrigido com botão X
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mobileCloseBtn = document.querySelector('.mobile-close-btn');
const menuIcon = menuBtn.querySelector('i');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
    lockScroll();
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
    unlockScroll();
}

function toggleMobileMenu() {
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

menuBtn.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);
if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
}

// Fechar menu ao clicar nos links
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// ===== MODAL CERTIFICAÇÕES =====
const modal = document.getElementById('certModal');
const openModalBtn = document.getElementById('openCertModal');
const closeModalBtn = modal ? modal.querySelector('.modal-close') : null;

function openModal() {
    if (!modal) return;
    modal.style.display = 'block';
    lockScroll();
    setTimeout(() => closeModalBtn && closeModalBtn.focus(), 50);
}

function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    unlockScroll();
}

if (openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', (e) => {
    if (!modal) return;
    if (e.target === modal) closeModal();
});

// ===== PROJETOS: TOUCH OPEN/CLOSE =====
(function() {
    const cards = document.querySelectorAll(".project-card");

    function closeAll() {
        cards.forEach(c => c.classList.remove("is-open"));
    }

    document.addEventListener("click", (e) => {
        const clickedCard = e.target.closest(".project-card");
        if (!clickedCard) closeAll();
    });

    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            const isTouch = window.matchMedia("(hover: none)").matches;

            if (!isTouch) return;

            const clickedLink = e.target.closest("a.project-link");
            const alreadyOpen = card.classList.contains("is-open");

            if (clickedLink && alreadyOpen) return;

            if (clickedLink && !alreadyOpen) {
                e.preventDefault();
            }

            if (!alreadyOpen) {
                closeAll();
                card.classList.add("is-open");
            } else {
                card.classList.remove("is-open");
            }
        }, { passive: false });
    });
})();

// ===== SMOOTH SCROLL CORRIGIDO =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const header = document.querySelector('header');
        const headerOffset = header ? header.getBoundingClientRect().height : 0;

        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
});

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        formMessage.style.display = 'block';
        formMessage.className = 'form-message';
        formMessage.innerHTML = 'Processando sua mensagem...';

        setTimeout(() => {
            formMessage.className = 'form-message success';
            formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada com sucesso! Entrarei em contato em breve.';

            contactForm.reset();

            submitBtn.innerHTML = '<span>Enviar Mensagem</span> <i class="fas fa-paper-plane"></i>';
            submitBtn.disabled = false;

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// ===== COMING SOON LINKS =====
document.querySelectorAll('.coming-soon').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('🚧 Projeto em desenvolvimento! Em breve estará disponível.');
    });
});

// ===== RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 991 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250);
});

// ===== ESC KEY HANDLER =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }
});

// ===== TOUCH DEVICE DETECTION =====
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LOAD INITIAL =====
window.addEventListener('load', () => {
    updateActiveLink();
});