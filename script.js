document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ІНТЕРАКТИВНА НАВІГАЦІЯ (Плавний скрол)
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Пропускаємо пусті посилання
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ==========================================
    // 2. ІНТЕРАКТИВНИЙ КОМПОНЕНТ №1 (Бургер-меню)
    // ==========================================
    const burgerBtn = document.querySelector('.burger-btn');
    const headerActions = document.querySelector('.header-actions');

    if (burgerBtn && headerActions) {
        burgerBtn.addEventListener('click', () => {
            // Перевіряємо поточний стан (приховано чи ні)
            const isHidden = window.getComputedStyle(headerActions).display === 'none';
            
            if (isHidden) {
                headerActions.style.display = 'flex';
                headerActions.style.flexDirection = 'column';
                headerActions.style.position = 'absolute';
                headerActions.style.top = '72px';
                headerActions.style.right = '20px';
                headerActions.style.background = '#FFFFFF';
                headerActions.style.padding = '20px';
                headerActions.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.1)';
                headerActions.style.borderRadius = '12px';
                headerActions.style.border = '1px solid var(--border-color)';
            } else {
                headerActions.style.display = ''; // Повертаємо до CSS-дефолту
            }
        });
    }

    // ==========================================
    // 3. ДИНАМІЧНА ЗМІНА ВМІСТУ (Видалення відгуків з делегуванням)
    // ==========================================
    const reviewsCard = document.querySelector('.reviews-card');
    const reviewsBadge = document.querySelector('.reviews-badge');

    if (reviewsCard) {
        // Використовуємо делегування подій - вішаємо один слухач на весь блок
        reviewsCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const reviewItem = e.target.closest('.review-item');
                
                if (reviewItem) {
                    // Анімація зникнення
                    reviewItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    reviewItem.style.opacity = '0';
                    reviewItem.style.transform = 'translateX(20px)';
                    
                    // Видаляємо з DOM після завершення анімації
                    setTimeout(() => {
                        reviewItem.remove();
                        
                        // Оновлюємо лічильник відгуків динамічно
                        const currentReviewsCount = document.querySelectorAll('.review-item').length;
                        if (reviewsBadge) {
                            reviewsBadge.textContent = `${currentReviewsCount} відгуки`;
                        }
                    }, 300);
                }
            }
        });
    }

    // ==========================================
    // 4. ВАЛІДАЦІЯ ФОРМИ (Клієнтська перевірка)
    // ==========================================
    const teacherForm = document.getElementById('teacher-form') || document.querySelector('.teacher-form');
    
    if (teacherForm) {
        // Створюємо контейнер для помилок
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-errors';
        errorContainer.style.color = 'var(--danger-color)';
        errorContainer.style.fontSize = '0.85rem';
        errorContainer.style.marginBottom = '16px';
        errorContainer.style.fontWeight = '600';
        
        // Вставляємо контейнер перед першим елементом форми
        teacherForm.insertBefore(errorContainer, teacherForm.firstChild);

        teacherForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Зупиняємо стандартну відправку форми
            errorContainer.innerHTML = ''; // Очищаємо старі помилки
            
            const courseName = document.getElementById('course-name');
            const courseDuration = document.getElementById('course-duration');
            const courseDesc = document.getElementById('course-desc');
            
            let errors = [];

            // Перевірка назви курсу
            if (!courseName.value.trim()) {
                errors.push("• Поле «Назва курсу» не може бути порожнім.");
                courseName.style.borderColor = 'var(--danger-color)';
            } else {
                courseName.style.borderColor = 'var(--border-color)';
            }

            // Перевірка тривалості
            if (courseDuration && !courseDuration.value.trim()) {
                errors.push("• Поле «Тривалість» не може бути порожнім.");
                courseDuration.style.borderColor = 'var(--danger-color)';
            } else if (courseDuration) {
                courseDuration.style.borderColor = 'var(--border-color)';
            }

            // Виведення результату
            if (errors.length > 0) {
                errorContainer.innerHTML = errors.join('<br>');
            } else {
    errorContainer.style.color = '#10B981'; // Зелений колір успіху
    errorContainer.innerHTML = 'Відправляємо дані на сервер...';

    // Збираємо дані з форми
    const courseData = {
        name: courseName.value.trim(),
        category: document.getElementById('course-cat') ? document.getElementById('course-cat').value : '', // Додано перевірку, якщо селекта немає
        duration: courseDuration.value.trim(),
        desc: courseDesc ? courseDesc.value.trim() : '' // Додано перевірку
    };

    // Відправляємо POST-запит на наш Node.js сервер
    fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            errorContainer.innerHTML = '✅ Форма успішно заповнена! Дані збережено в БД!';
            // Скидаємо форму через 2 секунди
            setTimeout(() => {
                teacherForm.reset();
                errorContainer.innerHTML = '';
                errorContainer.style.color = 'var(--danger-color)';
            }, 2000);
        }
    })
    .catch(error => {
        errorContainer.style.color = 'var(--danger-color)';
        errorContainer.innerHTML = '❌ Помилка з\'єднання з сервером!';
        console.error('Помилка fetch:', error);
    });
    }
});
}
    // ==========================================
    // 5. КНОПКА "ВІДКРИТИ ПОВНУ ФОРМУ"
    // ==========================================
    const openFormBtn = document.querySelector('.btn-white');
    const courseNameInput = document.getElementById('course-name');

    if (openFormBtn && courseNameInput) {
        openFormBtn.addEventListener('click', () => {
            // Плавный скролл к полю ввода
            courseNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Автоматически ставим курсор в поле
            setTimeout(() => {
                courseNameInput.focus();
            }, 500); // небольшая задержка, чтобы скролл успел доехать
        });
    }
});