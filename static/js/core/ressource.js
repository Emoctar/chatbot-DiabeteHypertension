document.addEventListener('DOMContentLoaded', function() {
            // Search functionality
            const searchInput = document.querySelector('.search-input');
            searchInput.addEventListener('focus', function() {
                this.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
            });
            searchInput.addEventListener('blur', function() {
                this.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
            });

            // Resource cards hover effect
            const resourceCards = document.querySelectorAll('.resource-card');
            resourceCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.classList.add('shadow-md');
                });
                card.addEventListener('mouseleave', function() {
                    this.classList.remove('shadow-md');
                });
            });

            // Download buttons
            const downloadButtons = document.querySelectorAll('button:has(.ri-download-line)');
            downloadButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="ri-check-line mr-2"></i>Téléchargé';
                    this.classList.remove('bg-primary');
                    this.classList.add('bg-green-500');

                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.remove('bg-green-500');
                        this.classList.add('bg-primary');
                    }, 2000);
                });
            });
        });