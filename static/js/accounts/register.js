document.addEventListener('DOMContentLoaded', function() {
            // Password visibility toggle
            const toggleButtons = document.querySelectorAll('.password-toggle');
            toggleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const input = this.previousElementSibling;
                    const icon = this.querySelector('i');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('ri-eye-off-line');
                        icon.classList.add('ri-eye-line');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('ri-eye-line');
                        icon.classList.add('ri-eye-off-line');
                    }
                });
            });

            // Password strength indicator
            const passwordInput = document.getElementById('password');
            const strengthIndicator = document.querySelector('.h-full.bg-gray-400');
            
            if (passwordInput) {
                passwordInput.addEventListener('input', function() {
                    const password = this.value;
                    let strength = 0;
                    
                    if (password.length >= 8) strength += 25;
                    if (password.match(/[a-z]+/)) strength += 25;
                    if (password.match(/[A-Z]+/)) strength += 25;
                    if (password.match(/[0-9]+/)) strength += 25;
                    
                    strengthIndicator.style.width = strength + '%';
                    
                    if (strength <= 25) {
                        strengthIndicator.classList.remove('bg-yellow-400', 'bg-green-400');
                        strengthIndicator.classList.add('bg-red-400');
                    } else if (strength <= 75) {
                        strengthIndicator.classList.remove('bg-red-400', 'bg-green-400');
                        strengthIndicator.classList.add('bg-yellow-400');
                    } else {
                        strengthIndicator.classList.remove('bg-red-400', 'bg-yellow-400');
                        strengthIndicator.classList.add('bg-green-400');
                    }
                });
            }
        });