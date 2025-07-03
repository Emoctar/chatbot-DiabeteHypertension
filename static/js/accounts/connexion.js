 document.addEventListener('DOMContentLoaded', function() {
            // Password visibility toggle
            const passwordToggle = document.querySelector('.password-toggle');
            const passwordInput = document.getElementById('id_password');
            
            passwordToggle.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                if (type === 'password') {
                    passwordToggle.classList.remove('ri-eye-line');
                    passwordToggle.classList.add('ri-eye-off-line');
                } else {
                    passwordToggle.classList.remove('ri-eye-off-line');
                    passwordToggle.classList.add('ri-eye-line');
                }
            });
        });