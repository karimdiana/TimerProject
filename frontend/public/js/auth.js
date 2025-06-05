function showForm(formId) {
    document.querySelectorAll('.form-section').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formId).classList.add('active');
}

function showSigningInMessage(event) {
    showNotification('Signing in...', 'success');
}

async function getSecurityQuestion() {
    const username = document.getElementById('reset-username').value;
    console.log('Fetching security question for:', username);

    try {
        const response = await fetch(`/auth/security-question/${username}`);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.error) {
            console.error('Error from server:', data.error);
            showNotification(data.error, 'error');
            return;
        }

        console.log('Security Question:', data.question);
        document.getElementById('security-question-text').textContent = data.question;
        document.getElementById('security-question-container').style.display = 'block';
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification('Failed to retrieve security question', 'error');
    }
}

function showNotification(message, type = 'error') {
    const notification = document.getElementById('errorMessage');
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 8000);
}

async function validateSignup() {
    const email = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    let isValid = true;

    // Clear previous messages
    const requirements = document.getElementById('email-requirements');
    requirements.textContent = '';

    // Check if email exists
    try {
        const response = await fetch(`/auth/check-email/${email}`);
        const data = await response.json();
        
        if (data.exists) {
            requirements.textContent = 'Email already taken';
            requirements.style.color = 'red';
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Validate email (.edu)
    if (!email.match(/.+@.+\.edu$/)) {
        showNotification('Email must be a valid .edu address', 'error');
        isValid = false;
    }
    const passwordReqs = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

    Object.keys(passwordReqs).forEach(req => {
        const li = document.getElementById(req);
        if (li) {
            if (passwordReqs[req]) {
                li.classList.add('valid');
            } else {
                li.classList.remove('valid');
                isValid = false;
            }
        }
    });

    if (!isValid) {
        showNotification('Please meet all password requirements', 'error');
        return false;
    }

    return true;
}

function validateSignIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }

    if (!username.match(/.+@.+\.edu$/)) {
        showNotification('Please use a valid .edu email address', 'error');
        return false;
    }

    return true;
}

function validatePasswordRequirements(passwordInput, prefix) {
    const password = passwordInput.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

    Object.keys(requirements).forEach(req => {
        const li = document.getElementById(prefix + req);
        if (li) {
            if (requirements[req]) {
                li.classList.add('valid');
            } else {
                li.classList.remove('valid');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const signupPasswordInput = document.getElementById('signup-password');
    if (signupPasswordInput) {
        signupPasswordInput.addEventListener('input', () => validatePasswordRequirements(signupPasswordInput, ''));
    }

    const resetPasswordInput = document.getElementById('new-password');
    if (resetPasswordInput) {
        resetPasswordInput.addEventListener('input', () => validatePasswordRequirements(resetPasswordInput, 'reset-'));
    }
});

window.addEventListener('load', () => {
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            const securityAnswer = document.getElementById('reset-answer').value;
            const newPassword = document.getElementById('new-password').value;
            
            if (!securityAnswer || !newPassword) {
                e.preventDefault();
                showNotification('Please fill in all fields', 'error');
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        const error = urlParams.get('error');
        const messages = {
            'username_taken': 'Username already taken',
            'signup_failed': 'Sign up failed',
            'user_not_found': 'User not found',
            'wrong_answer': 'Incorrect security answer',
            'reset_failed': 'Password reset failed',
            'invalid_password': 'Invalid username or password',
            'invalid_email': 'Invalid email address',
            'login_failed': 'Login failed. Please try again.'
        };
        showNotification(messages[error] || 'An error occurred', 'error');
    } else if (urlParams.has('success')) {
        const success = urlParams.get('success');
        const messages = {
            'user_created': 'Account created successfully!',
            'password_reset': 'Password reset successful!',
            'signed_in': 'Sign in successful!'
        };
        showNotification(messages[success] || 'Success!', 'success');
    }
});
