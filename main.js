// L&A Maq Main JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // Alternância do Menu Mobile
    const mobileMenu = document.getElementById('alternancia-de-menu');
    const navLinks = document.querySelector('.links-de-navegacao');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Alternância do ícone
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Fechar o menu mobile quando um link é clicado
    const links = document.querySelectorAll('.links-de-navegacao a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenu) {
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Rolagem suave para todos os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Efeito de rolagem da barra de navegação
    const navbar = document.getElementById('barra-de-navegacao');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        }
    });

    // Manipulação do formulário de contato (Mock)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function () {
            const btn = contactForm.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            // O formulário será enviado naturalmente para sua URL de ação
        });
    }

    // Animação de revelação de rolagem (entrada CSS)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.cartão.de.serviço, .item.de.diferencial, .cartão.de.depoimento, .imagem-sobre').forEach(el => {
        el.style.opacity = '0'; // Começa invisível
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
