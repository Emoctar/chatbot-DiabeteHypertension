
        document.addEventListener('DOMContentLoaded', function() {
            // FAQ Accordion
            const faqButtons = document.querySelectorAll('.faq-section button');
            faqButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const content = button.nextElementSibling;
                    const icon = button.querySelector('i');

                    if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        icon.classList.remove('ri-arrow-down-s-line');
                        icon.classList.add('ri-arrow-up-s-line');
                    } else {
                        content.classList.add('hidden');
                        icon.classList.remove('ri-arrow-up-s-line');
                        icon.classList.add('ri-arrow-down-s-line');
                    }
                });
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const menuButton = document.querySelector('.ri-menu-line').parentElement;
            const nav = document.querySelector('nav');

            menuButton.addEventListener('click', () => {
                if (nav.classList.contains('hidden')) {
                    nav.classList.remove('hidden');
                    nav.classList.add('flex', 'flex-col', 'absolute', 'top-16', 'left-0', 'right-0', 'bg-white', 'shadow-md', 'p-4', 'space-y-4', 'z-50');
                } else {
                    nav.classList.add('hidden');
                    nav.classList.remove('flex', 'flex-col', 'absolute', 'top-16', 'left-0', 'right-0', 'bg-white', 'shadow-md', 'p-4', 'space-y-4', 'z-50');
                }
            });
        });
