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

    // Form Submit Handling
    const tgForm = document.getElementById("tg");
    if (tgForm) {
        tgForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const CHAT_ID = "410783080";
            const URI_API = "https://api.telegram.org/bot7974988414:AAHZy2qsU9XD-4Wtsq5tN-phJvJ_So4VnvM/sendMessage";
            
            let massage = "<b>Заявка с сайта:</b>\n";
            const phoneInput = document.getElementById("user_phone");
            if (phoneInput) {
                massage += phoneInput.value;
            }

            if (typeof axios !== 'undefined') {
                axios.post(URI_API, {
                    chat_id: CHAT_ID,
                    parse_mode: "html",
                    text: massage,
                }).then((res) => {
                    if (phoneInput) phoneInput.value = "";
                    const success = document.getElementById("success");
                    if (success) success.style.display = "block";
                }).catch(err => {
                    console.error("Ошибка отправки заявки", err);
                });
            } else {
                console.error("Axios не загружен");
            }
        });
    }
});
