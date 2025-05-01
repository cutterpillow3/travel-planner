document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const loginMessageDiv = document.getElementById('loginMessage');
    const registrationMessageDiv = document.getElementById('registrationMessage');
    const openLoginPopup = document.getElementById('openLoginPopup');
    const openRegistrationPopup = document.getElementById('openRegistrationPopup');
    const userAccountSpan = document.getElementById('user-account');
    const logoutButton = document.getElementById('logout-button');
    const navButtons = document.querySelector('header nav'); // Select the nav to hide buttons
    const loginPopupDiv = document.getElementById('loginPopup');
    const overlayLoginDiv = document.getElementById('overlayLogin');
    const registrationPopupDiv = document.getElementById('registrationPopup');
    const overlayRegistrationDiv = document.getElementById('overlayRegistration');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const username = usernameInput.value;
            const password = passwordInput.value;

            loginMessageDiv.style.display = 'none';
            loginMessageDiv.textContent = '';

            if ((username === 'testuser' && password === 'simplepassword') ||
                (username === 'explorer' && password === 'travel123') ||
                (username === 'guest' && password === 'justlooking')) {
                loginMessageDiv.textContent = 'Login successful!';
                loginMessageDiv.style.color = 'green';
                loginMessageDiv.style.display = 'block';

                // Simulate logged-in state
                if (navButtons) navButtons.style.display = 'none'; // Hide Login/Register buttons
                if (userAccountSpan) {
                    userAccountSpan.textContent = `Hi, ${username}`;
                    userAccountSpan.style.display = 'inline';
                }
                if (logoutButton) logoutButton.style.display = 'inline';
                closeLoginPopup(); // Close the login popup
            } else {
                loginMessageDiv.textContent = 'Login failed. Incorrect username or password.';
                loginMessageDiv.style.color = 'red';
                loginMessageDiv.style.display = 'block';
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Simulate logout
            if (navButtons) navButtons.style.display = 'block'; // Show Login/Register buttons
            if (userAccountSpan) {
                userAccountSpan.style.display = 'none';
                userAccountSpan.textContent = '';
            }
            logoutButton.style.display = 'none';
            alert('Logged out.'); // Simple logout feedback
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newUsernameInput = document.getElementById('newUsername');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const newUsername = newUsernameInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            registrationMessageDiv.style.display = 'none';
            registrationMessageDiv.textContent = '';

            if (newPassword !== confirmPassword) {
                registrationMessageDiv.textContent = 'Registration failed. Passwords do not match.';
                registrationMessageDiv.style.color = 'red';
                registrationMessageDiv.style.display = 'block';
            } else {
                registrationMessageDiv.textContent = 'Thank you for registering! You can now proceed to log in.';
                registrationMessageDiv.style.color = 'green';
                registrationMessageDiv.style.display = 'block';
                setTimeout(closeRegistrationPopup, 2000); // Close after 2 seconds
            }
        });
    }

    function closeLoginPopup() {
        if (loginPopupDiv) loginPopupDiv.style.display = 'none';
        if (overlayLoginDiv) overlayLoginDiv.style.display = 'none';
    }

    function closeRegistrationPopup() {
        if (registrationPopupDiv) registrationPopupDiv.style.display = 'none';
        if (overlayRegistrationDiv) overlayRegistrationDiv.style.display = 'none';
    }

    if (openLoginPopup) {
        openLoginPopup.addEventListener('click', () => {
            if (loginPopupDiv) loginPopupDiv.style.display = 'block';
            if (overlayLoginDiv) overlayLoginDiv.style.display = 'block';
        });
    }

    const closeLoginButton = document.getElementById('closeLogin');
    if (closeLoginButton) closeLoginButton.addEventListener('click', closeLoginPopup);
    if (overlayLoginDiv) overlayLoginDiv.addEventListener('click', closeLoginPopup);

    if (openRegistrationPopup) {
        openRegistrationPopup.addEventListener('click', () => {
            if (registrationPopupDiv) registrationPopupDiv.style.display = 'block';
            if (overlayRegistrationDiv) overlayRegistrationDiv.style.display = 'block';
        });
    }

    const closeRegistrationButton = document.getElementById('closeRegistration');
    if (closeRegistrationButton) closeRegistrationButton.addEventListener('click', closeRegistrationPopup);
    if (overlayRegistrationDiv) overlayRegistrationDiv.addEventListener('click', closeRegistrationPopup);

    const showRegistrationFromLoginLink = document.getElementById('showRegistrationFromLogin');
    if (showRegistrationFromLoginLink) {
        showRegistrationFromLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeLoginPopup();
            if (registrationPopupDiv) registrationPopupDiv.style.display = 'block';
            if (overlayRegistrationDiv) overlayRegistrationDiv.style.display = 'block';
        });
    }

    const showLoginFromRegistrationLink = document.getElementById('showLoginFromRegistration');
    if (showLoginFromRegistrationLink) {
        showLoginFromRegistrationLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeRegistrationPopup();
            if (loginPopupDiv) loginPopupDiv.style.display = 'block';
            if (overlayLoginDiv) overlayLoginDiv.style.display = 'block';
        });
    }
});
