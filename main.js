document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Handling
    const check = document.getElementById('check');
    
    if (check) {
        check.addEventListener('change', (e) => {
            document.body.style.overflow = e.target.checked ? 'hidden' : '';
        });
    }

    let startX = 0;
    document.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].screenX;
    }, {passive: true});

    document.addEventListener('touchend', e => {
        let endX = e.changedTouches[0].screenX;
        if (check && check.checked && (endX - startX > 50)) {
            check.checked = false;
            document.body.style.overflow = '';
        }
    }, {passive: true});

    // Close mobile menu on link click, but not for submenu toggles
    const navLinks = document.querySelectorAll('.nav a:not(.sub-button1)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (check && check.checked) {
                check.checked = false;
                document.body.style.overflow = '';
            }
        });
    });

    // Touch support for sub-menu
    document.querySelectorAll('.sub-button1').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                const subMenu = e.currentTarget.nextElementSibling;
                if (subMenu) {
                    subMenu.classList.toggle('touch-open');
                }
            }
        });
    });

    // Prices Handling
    const PRICES = {
        alc: 3800,
        beauty: 1900,
        detox: 2900,
        immunity: 1600,
        nurse: 600,
        iv_home: 600,
        poisoning: 2900
    };

    for (const key in PRICES) {
        const id = 'price-' + key.replace('_', '-');
        const el = document.getElementById(id);
        if (el) {
            el.textContent = PRICES[key];
        }
    }

    // ============================================================
    // 🤖 ФОРМА ВІДПРАВКИ ТЕЛЕГРАМ БОТУ (ПРАЦЮЄ НА ВСІХ ПРИСТРОЯХ)
    // ============================================================
    const tgForms = document.querySelectorAll("form#tg, form#contactForm");
    
    tgForms.forEach(tgForm => {
        tgForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Зупиняємо стандартну відправку форми

            const BOT_TOKEN = '7974988414:AAFdwmrO3nW31tluHFA7tVgclsvokDedzH8';
            const CHAT_ID = '410783080';

            // Шукаємо поля всередині конкретної форми
            const nameInput = tgForm.querySelector('input[name="userName"], input#userName');
            const phoneInput = tgForm.querySelector('input[name="userPhone"], input#userPhone, input[name="user_phone"], input#user_phone');

            const name = nameInput ? nameInput.value.trim() : 'Клієнт (без імені)';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            if (!phone || phone.length < 10) {
                alert('Будь ласка, введіть коректний номер телефону');
                return;
            }

            // Формуємо текст повідомлення
            const text = '📝 Нова заявка з сайту\n\n' +
                '👤 Ім\'я: ' + name + '\n' +
                '📱 Телефон: ' + phone + '\n\n' +
                '🕒 Час: ' + new Date().toLocaleString('uk-UA');

            const URI_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            
            // Використовуємо нативний Fetch API замість iframe/axios
            // (100% гарантія роботи на iPhone та Android)
            const bodyData = new URLSearchParams({
                chat_id: CHAT_ID,
                text: text
            });

            fetch(URI_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyData.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert('✅ Заявку надіслано! Ми зв\'яжемося з вами найближчим часом.');
                    
                    if (phoneInput) phoneInput.value = '+380';
                    if (nameInput) nameInput.value = '';
                    
                    const success = tgForm.querySelector("#success");
                    if (success) success.style.display = "block";
                } else {
                    alert('Помилка відправки. Спробуйте ще раз.');
                }
            })
            .catch(error => {
                console.error("Помилка відправки заявки:", error);
                alert('Помилка відправки. Перевірте інтернет-з\'єднання.');
            });
        });
    });
});
