/* ============================================
   Admin Sign-In Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signinForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');

    // Form fields
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');

    // ============================================
    // PASSWORD VISIBILITY TOGGLE
    // ============================================

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = togglePassword.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function isEmail(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    }

    function isAdminId(value) {
        const re = /^ACS-\d{2}$/i;
        return re.test(value);
    }

    function showFieldError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        let hint = input.parentElement.querySelector('.form-hint');
        if (!hint) {
            hint = document.createElement('span');
            hint.className = 'form-hint error';
            input.parentElement.appendChild(hint);
        }
        hint.textContent = message;
        hint.classList.add('error');
    }

    function clearFieldState(input) {
        input.classList.remove('error', 'success');
        const hint = input.parentElement.querySelector('.form-hint.error');
        if (hint) hint.remove();
    }

    // Clear errors on input
    identifierInput.addEventListener('input', () => clearFieldState(identifierInput));
    passwordInput.addEventListener('input', () => clearFieldState(passwordInput));

    // ============================================
    // GET EMAIL FROM ADMIN ID
    // ============================================

    async function getEmailFromAdminId(adminId) {
        const { data, error } = await window.supabaseClient
            .from('admins')
            .select('email')
            .eq('admin_id', adminId.toUpperCase())
            .single();

        if (error || !data) {
            return null;
        }

        return data.email;
    }

    // ============================================
    // FORM SUBMISSION
    // ============================================

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;

        // Validate
        let isValid = true;

        if (!identifier) {
            showFieldError(identifierInput, 'Email or Admin ID is required');
            isValid = false;
        }

        if (!password) {
            showFieldError(passwordInput, 'Password is required');
            isValid = false;
        }

        if (!isValid) {
            window.toast.error('Validation Error', 'Please fill in all required fields');
            return;
        }

        // Show loading
        submitBtn.disabled = true;
        submitText.textContent = 'Signing In...';
        submitSpinner.style.display = 'block';

        try {
            let email = identifier;

            // If identifier is an Admin ID, get the email
            if (isAdminId(identifier)) {
                email = await getEmailFromAdminId(identifier);
                if (!email) {
                    throw new Error('Admin ID not found. Please check and try again.');
                }
            } else if (!isEmail(identifier)) {
                throw new Error('Please enter a valid email address or Admin ID (e.g., ACS-01)');
            }

            // Sign in with Supabase
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            // Check if email is verified
            if (!data.user.email_confirmed_at) {
                window.modal.warning(
                    'Email Not Verified',
                    'Please verify your email before signing in. Check your inbox for the verification link.',
                    [
                        {
                            text: 'Resend Email',
                            type: 'secondary',
                            onClick: async () => {
                                await window.supabaseClient.auth.resend({
                                    type: 'signup',
                                    email: email
                                });
                                window.toast.success('Email Sent', 'Verification email has been resent.');
                            },
                            closeOnClick: false
                        },
                        {
                            text: 'OK',
                            type: 'primary'
                        }
                    ]
                );
                await window.supabaseClient.auth.signOut();
                return;
            }

            // Update email_verified in admins table
            await window.supabaseClient
                .from('admins')
                .update({ email_verified: true })
                .eq('email', email);

            // Success - redirect to dashboard
            window.toast.success('Welcome!', 'Signed in successfully. Redirecting...');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Sign in error:', error);

            let errorMessage = 'Something went wrong. Please try again.';

            if (error.message) {
                if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'Invalid email/ID or password. Please try again.';
                } else if (error.message.includes('Email not confirmed')) {
                    errorMessage = 'Please verify your email before signing in.';
                } else {
                    errorMessage = error.message;
                }
            }

            window.modal.error('Sign In Failed', errorMessage);

        } finally {
            submitBtn.disabled = false;
            submitText.textContent = 'Sign In';
            submitSpinner.style.display = 'none';
        }
    });
});
