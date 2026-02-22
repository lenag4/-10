document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Сбрасываем предыдущие ошибки
        document.querySelectorAll('.form-control.is-invalid, .form-select.is-invalid, .form-check-input.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        
        let isValid = true;
        
        // 1. Проверка Имени (не пустое)
        const firstName = document.getElementById('firstName');
        const firstNameValue = firstName.value.trim();
        
        if (firstNameValue === '') {
            showError(firstName, 'Введите имя');
            isValid = false;
        }
        
        // 2. Проверка Фамилии (не пустое)
        const lastName = document.getElementById('lastName');
        const lastNameValue = lastName.value.trim();
        
        if (lastNameValue === '') {
            showError(lastName, 'Введите фамилию');
            isValid = false;
        }
        
        // 3. Проверка email (не пустой, содержит @ и .)
        const email = document.getElementById('email');
        const emailValue = email.value.trim();
        
        if (emailValue === '') {
            showError(email, 'Введите email');
            isValid = false;
        } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
            showError(email, 'Введите корректный email');
            isValid = false;
        }
        
        // 4. Проверка темы (не выбрана тема по умолчанию)
        const topic = document.querySelector('select[aria-label="Пример выбора по умолчанию"]');
        const topicValue = topic.value;
        
        if (topicValue === 'Выберите тему') {
            showError(topic, 'Выберите тему сообщения');
            isValid = false;
        }
        
        // 5. Проверка сообщения (не пустое)
        const message = document.getElementById('exampleFormControlTextarea1');
        const messageValue = message.value.trim();
        
        if (messageValue === '') {
            showError(message, 'Введите текст сообщения');
            isValid = false;
        }
        
        // 6. Проверка согласия на обработку данных
        const consent = document.getElementById('flexCheckChecked');
        
        if (!consent.checked) {
            showError(consent, 'Необходимо согласие на обработку персональных данных');
            isValid = false;
        }
        
        // Если всё корректно - отправляем событие
        if (isValid) {
            const formData = {
                firstName: firstNameValue,
                lastName: lastNameValue,
                email: emailValue,
                topic: topicValue,
                message: messageValue,
                consent: consent.checked
            };
            
            const event = new CustomEvent('formValid', { detail: formData });
            document.dispatchEvent(event);
            
            alert('Форма отправлена! Данные в консоли.');
        } else {
            form.classList.add('was-validated');
        }
    });
    
    // Функция показа ошибки
    function showError(input, message) {
        input.classList.add('is-invalid');
        
        let help = input.nextElementSibling;
        if (!help || !help.classList.contains('invalid-feedback')) {
            help = document.createElement('div');
            help.classList.add('invalid-feedback');
            
            if (input.type === 'checkbox') {
                const parentDiv = input.closest('.form-check');
                parentDiv.appendChild(help);
            } else {
                input.parentNode.appendChild(help);
            }
        }
        
        help.textContent = message;
        help.style.display = 'block';
    }
    
    // Сброс ошибки при вводе
    document.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            
            // Удаляем сообщение об ошибке
            if (this.type === 'checkbox') {
                const parentDiv = this.closest('.form-check');
                const errors = parentDiv.querySelectorAll('.invalid-feedback');
                errors.forEach(el => el.remove());
            } else {
                const errors = this.parentNode.querySelectorAll('.invalid-feedback');
                errors.forEach(el => el.remove());
            }
            
            form.classList.remove('was-validated');
        });
        
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                this.classList.remove('is-invalid');
                const errors = this.parentNode.querySelectorAll('.invalid-feedback');
                errors.forEach(el => el.remove());
                form.classList.remove('was-validated');
            });
        }
    });
});