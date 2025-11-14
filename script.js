class Slider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dotsContainer = document.querySelector('.slider-dots');
        this.prevButton = document.querySelector('.prev-button');
        this.nextButton = document.querySelector('.next-button');
        this.currentSlide = 0;
        
        this.init();
    }
    
    init() {
        // Создаем точки для слайдера
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        
        // Добавляем обработчики событий
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
        
        // Автопереключение слайдов
        this.startAutoSlide();
        
        // Останавливаем автопереключение при наведении
        const slider = document.querySelector('.slider-container');
        slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    goToSlide(n) {
        this.slides[this.currentSlide].classList.remove('active');
        this.updateDots(this.currentSlide, false);
        
        this.currentSlide = (n + this.slides.length) % this.slides.length;
        
        this.slides[this.currentSlide].classList.add('active');
        this.updateDots(this.currentSlide, true);
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    updateDots(index, isActive) {
        const dots = document.querySelectorAll('.dot');
        dots[index].classList.toggle('active', isActive);
    }
    
    startAutoSlide() {
        this.autoSlide = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoSlide() {
        clearInterval(this.autoSlide);
    }
}

// Модальное окно для галереи
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('gallery-modal');
        this.modalImg = document.getElementById('modal-image');
        this.caption = document.querySelector('.modal-caption');
        this.closeBtn = document.querySelector('.close');
        
        this.init();
    }
    
    init() {
        // Закрытие модального окна
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }
    
    openModal(img) {
        this.modal.style.display = 'block';
        this.modalImg.src = img.src;
        this.caption.textContent = img.alt;
    }
    
    closeModal() {
        this.modal.style.display = 'none';
    }
}

// Плавная прокрутка
class SmoothScroll {
    constructor() {
        this.scrollToTopBtn = document.getElementById('scroll-to-top');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        this.init();
    }
    
    init() {
        // Показ/скрытие кнопки "Наверх"
        window.addEventListener('scroll', () => this.toggleScrollToTop());
        this.scrollToTopBtn.addEventListener('click', () => this.scrollToTop());
        
        // Плавная прокрутка для навигационных ссылок
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }
    
    toggleScrollToTop() {
        if (window.pageYOffset > 300) {
            this.scrollToTopBtn.classList.add('show');
        } else {
            this.scrollToTopBtn.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Учитываем высоту шапки
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Валидация формы
class FormValidator {
    constructor(formId = 'appointment-form') {
        this.form = document.getElementById(formId);
        
        if (!this.form) {
            console.error(`Форма с ID "${formId}" не найдена`);
            return;
        }
        
        this.fields = {
            name: this.form.querySelector('[name="name"]'),
            phone: this.form.querySelector('[name="phone"]'),
            email: this.form.querySelector('[name="email"]')
        };
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Добавляем валидацию в реальном времени
        this.addRealTimeValidation();
    }
    
    addRealTimeValidation() {
        // Валидация при вводе данных
        if (this.fields.name) {
            this.fields.name.addEventListener('blur', () => {
                this.validateField('name', this.fields.name.value);
            });
        }
        
        if (this.fields.phone) {
            this.fields.phone.addEventListener('blur', () => {
                this.validateField('phone', this.fields.phone.value);
            });
            
            // Маска для телефона
            this.fields.phone.addEventListener('input', (e) => {
                this.formatPhone(e.target);
            });
        }
        
        if (this.fields.email) {
            this.fields.email.addEventListener('blur', () => {
                this.validateField('email', this.fields.email.value);
            });
        }
    }
    
    updateFieldStatus(fieldName, error) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        // Удаляем старые сообщения об ошибках
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Обновляем стили поля
        field.classList.remove('valid', 'invalid');
        
        if (error) {
            field.classList.add('invalid');
            // Показываем ошибку под полем
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            errorElement.textContent = error;
            field.parentNode.appendChild(errorElement);
        } else if (field.value.trim()) {
            field.classList.add('valid');
        }
    }
    
    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }
        
        let formattedValue = '+7 ';
        if (value.length > 0) formattedValue += '(' + value.substring(0, 3);
        if (value.length > 3) formattedValue += ') ' + value.substring(3, 6);
        if (value.length > 6) formattedValue += '-' + value.substring(6, 8);
        if (value.length > 8) formattedValue += '-' + value.substring(8, 10);
        
        input.value = formattedValue;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Валидация всех полей
        const nameError = this.validateField('name', data.name || '');
        const phoneError = this.validateField('phone', data.phone || '');
        const emailError = this.validateField('email', data.email || '');
        
        // Проверяем, что нет ошибок
        const hasErrors = nameError || phoneError || emailError;
        
        if (!hasErrors) {
            // Все проверки пройдены
            this.showMessage('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            this.sendToServer(data);
            this.form.reset();
            
            // Сбрасываем визуальные состояния
            Object.values(this.fields).forEach(field => {
                if (field) field.classList.remove('valid', 'invalid');
            });
        } else {
            // Есть ошибки
            this.showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
        }
    }

    validateField(fieldName, value) {
        const validators = {
            name: (val) => {
                if (!val.trim()) return 'Имя обязательно для заполнения';
                if (val.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
                if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(val)) return 'Имя может содержать только буквы';
                return null;
            },
            
            phone: (val) => {
                if (!val.trim()) return 'Телефон обязателен для заполнения';
                const cleanPhone = val.replace(/\D/g, '');
                
                // Исправленная проверка
                const isValid = 
                    (cleanPhone.length === 10 && cleanPhone.startsWith('9')) || // 9123456789
                    (cleanPhone.length === 11 && (cleanPhone.startsWith('79') || cleanPhone.startsWith('89'))); // 79123456789 или 89123456789
                
                if (!isValid) {
                    return 'Введите корректный номер в формате: 9123456789';
                }
                return null;
            },
            
            email: (val) => {
                if (val.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    return 'Введите корректный email адрес';
                }
                return null;
            }
        };
        
        const error = validators[fieldName] ? validators[fieldName](value) : null;
        this.updateFieldStatus(fieldName, error);
        return error; // Теперь возвращает саму ошибку (или null если ошибок нет)
    }
    
    showMessage(message, type) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            ${type === 'success' 
                ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
                : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Анимации при скролле
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }
    
    observeElements() {
        const elementsToAnimate = document.querySelectorAll('.service-card, .gallery-item, .about-content > *');
        
        elementsToAnimate.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    }
}

// Глобальные функции для вызова из HTML
function openModal(img) {
    galleryModal.openModal(img);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация компонентов
    const slider = new Slider();
    const galleryModal = new GalleryModal();
    const smoothScroll = new SmoothScroll();
    const formValidator = new FormValidator();
    const scrollAnimations = new ScrollAnimations();
    
    // Делаем глобальными для доступа из HTML
    window.galleryModal = galleryModal;
    
    // Добавляем CSS для анимаций
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card, .gallery-item {
            transition-delay: calc(var(--delay, 0) * 0.1s);
        }
    `;
    document.head.appendChild(style);
    
    // Устанавливаем задержки для анимаций
    document.querySelectorAll('.service-card, .gallery-item').forEach((el, index) => {
        el.style.setProperty('--delay', index);
    });
});