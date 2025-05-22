
        document.addEventListener('DOMContentLoaded', function() {
            // Form validation
            const contactForm = document.getElementById('contactForm');
            const formInputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
            const successMessage = document.querySelector('.success-message');

            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;

                formInputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.classList.add('error');
                        isValid = false;
                    } else {
                        input.classList.remove('error');
                    }

                    if (input.type === 'email' && input.value.trim()) {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(input.value)) {
                            input.classList.add('error');
                            isValid = false;
                        }
                    }
                });

                if (isValid) {
                    // Simulate form submission
                    contactForm.reset();
                    successMessage.classList.add('show');

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                }
            });

            // Clear error state on input
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                });
            });

            // FAQ Accordion
            const faqButtons = document.querySelectorAll('section:nth-of-type(5) button');
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
