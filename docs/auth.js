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

    // Event listener for login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener for logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Event listener for registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    // Open login popup
    if (openLoginPopup) {
        openLoginPopup.addEventListener('click', () => togglePopup(loginPopupDiv, overlayLoginDiv, true));
    }

    // Open registration popup
    if (openRegistrationPopup) {
        openRegistrationPopup.addEventListener('click', () => togglePopup(registrationPopupDiv, overlayRegistrationDiv, true));
    }

    // Close login popup
    const closeLoginButton = document.getElementById('closeLogin');
    if (closeLoginButton) closeLoginButton.addEventListener('click', () => togglePopup(loginPopupDiv, overlayLoginDiv, false));
    if (overlayLoginDiv) overlayLoginDiv.addEventListener('click', () => togglePopup(loginPopupDiv, overlayLoginDiv, false));

    // Close registration popup
    const closeRegistrationButton = document.getElementById('closeRegistration');
    if (closeRegistrationButton) closeRegistrationButton.addEventListener('click', () => togglePopup(registrationPopupDiv, overlayRegistrationDiv, false));
    if (overlayRegistrationDiv) overlayRegistrationDiv.addEventListener('click', () => togglePopup(registrationPopupDiv, overlayRegistrationDiv, false));

    // Show registration form from login
    const showRegistrationFromLoginLink = document.getElementById('showRegistrationFromLogin');
    if (showRegistrationFromLoginLink) {
        showRegistrationFromLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            togglePopup(loginPopupDiv, overlayLoginDiv, false);
            togglePopup(registrationPopupDiv, overlayRegistrationDiv, true);
        });
    }

    // Show login form from registration
    const showLoginFromRegistrationLink = document.getElementById('showLoginFromRegistration');
    if (showLoginFromRegistrationLink) {
        showLoginFromRegistrationLink.addEventListener('click', (e) => {
            e.preventDefault();
            togglePopup(registrationPopupDiv, overlayRegistrationDiv, false);
            togglePopup(loginPopupDiv, overlayLoginDiv, true);
        });
    }

    // Handle login
    function handleLogin(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const username = usernameInput.value;
        const password = passwordInput.value;

        resetLoginMessage();

        if (isValidLogin(username, password)) {
            displayLoginMessage('Login successful!', 'green');
            simulateLogin(username);
            closeLoginPopup(); // Close the login popup
        } else {
            displayLoginMessage('Login failed. Incorrect username or password.', 'red');
        }
    }

    // Handle logout
    function handleLogout() {
        simulateLogout();
        alert('Logged out.'); // Simple logout feedback
    }

    // Handle registration
    function handleRegistration(event) {
        event.preventDefault();
        const newUsernameInput = document.getElementById('newUsername');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const newUsername = newUsernameInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        resetRegistrationMessage();

        if (newPassword !== confirmPassword) {
            displayRegistrationMessage('Registration failed. Passwords do not match.', 'red');
        } else {
            displayRegistrationMessage('Thank you for registering! You can now proceed to log in.', 'green');
            setTimeout(closeRegistrationPopup, 2000); // Close after 2 seconds
        }
    }

    // Toggle popup visibility
    function togglePopup(popupDiv, overlayDiv, isVisible) {
        if (popupDiv) popupDiv.style.display = isVisible ? 'block' : 'none';
        if (overlayDiv) overlayDiv.style.display = isVisible ? 'block' : 'none';
    }

    // Reset login message
    function resetLoginMessage() {
        loginMessageDiv.style.display = 'none';
        loginMessageDiv.textContent = '';
    }

    // Display login message
    function displayLoginMessage(message, color) {
        loginMessageDiv.textContent = message;
        loginMessageDiv.style.color = color;
        loginMessageDiv.style.display = 'block';
    }

    // Check if login credentials are valid
    function isValidLogin(username, password) {
        return (username === 'testuser' && password === 'simplepassword') ||
               (username === 'explorer' && password === 'travel123') ||
               (username === 'guest' && password === 'justlooking');
    }

    // Simulate user login
    function simulateLogin(username) {
        if (navButtons) navButtons.style.display = 'none'; // Hide Login/Register buttons
        if (userAccountSpan) {
            userAccountSpan.textContent = `Hi, ${username}`;
            userAccountSpan.style.display = 'inline';
        }
        if (logoutButton) logoutButton.style.display = 'inline';
    }

    // Simulate user logout
    function simulateLogout() {
        if (navButtons) navButtons.style.display = 'block'; // Show Login/Register buttons
        if (userAccountSpan) {
            userAccountSpan.style.display = 'none';
            userAccountSpan.textContent = '';
        }
        logoutButton.style.display = 'none';
    }

    // Reset registration message
    function resetRegistrationMessage() {
        registrationMessageDiv.style.display = 'none';
        registrationMessageDiv.textContent = '';
    }

    // Display registration message
    function displayRegistrationMessage(message, color) {
        registrationMessageDiv.textContent = message;
        registrationMessageDiv.style.color = color;
        registrationMessageDiv.style.display = 'block';
    }
});
