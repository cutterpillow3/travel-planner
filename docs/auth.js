document.addEventListener('DOMContentLoaded', () => {
    // Constants for messages
    const LOGIN_SUCCESS_MESSAGE = 'Login successful!';
    const LOGIN_FAILED_MESSAGE = 'Login failed. Incorrect username or password.';
    const REGISTRATION_SUCCESS_MESSAGE = 'Thank you for registering! You can now proceed to log in.';
    const PASSWORD_MISMATCH_MESSAGE = 'Registration failed. Passwords do not match.';

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const loginMessageDiv = document.getElementById('loginMessage');
    const registrationMessageDiv = document.getElementById('registrationMessage');
    const openLoginPopup = document.getElementById('openLoginPopup');
    const openRegistrationPopup = document.getElementById('openRegistrationPopup');
    const userAccountSpan = document.getElementById('user-account');
    const logoutButton = document.getElementById('logout-button');
    const navButtons = document.querySelector('header nav');
    const loginPopupDiv = document.getElementById('loginPopup');
    const overlayLoginDiv = document.getElementById('overlayLogin');
    const registrationPopupDiv = document.getElementById('registrationPopup');
    const overlayRegistrationDiv = document.getElementById('overlayRegistration');

    // Event Listeners
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (registrationForm) registrationForm.addEventListener('submit', handleRegistration);
    if (openLoginPopup) openLoginPopup.addEventListener('click', () => togglePopup(loginPopupDiv, overlayLoginDiv, true));
    if (openRegistrationPopup) openRegistrationPopup.addEventListener('click', () => togglePopup(registrationPopupDiv, overlayRegistrationDiv, true));

    // Close popups
    setupPopupClose(loginPopupDiv, overlayLoginDiv, 'closeLogin');
    setupPopupClose(registrationPopupDiv, overlayRegistrationDiv, 'closeRegistration');

    // Show registration form from login
    setupSwitchFormLink('showRegistrationFromLogin', loginPopupDiv, overlayLoginDiv, registrationPopupDiv, overlayRegistrationDiv);
    // Show login form from registration
    setupSwitchFormLink('showLoginFromRegistration', registrationPopupDiv, overlayRegistrationDiv, loginPopupDiv, overlayLoginDiv);

    // Function to set up popup close functionality
    function setupPopupClose(popupDiv, overlayDiv, closeButtonId) {
        const closeButton = document.getElementById(closeButtonId);
        if (closeButton) closeButton.addEventListener('click', () => togglePopup(popupDiv, overlayDiv, false));
        if (overlayDiv) overlayDiv.addEventListener('click', () => togglePopup(popupDiv, overlayDiv, false));
    }

    // Function to set up switching form links
    function setupSwitchFormLink(linkId, currentPopupDiv, currentOverlayDiv, targetPopupDiv, targetOverlayDiv) {
        const link = document.getElementById(linkId);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                togglePopup(currentPopupDiv, currentOverlayDiv, false);
                togglePopup(targetPopupDiv, targetOverlayDiv, true);
            });
        }
    }

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    resetLoginMessage();

    if (isValidLogin(username, password)) {
        displayLoginMessage(LOGIN_SUCCESS_MESSAGE, 'green');
        simulateLogin(username);
        togglePopup(loginPopupDiv, overlayLoginDiv, false); // Close the login popup
    } else {
        displayLoginMessage(LOGIN_FAILED_MESSAGE, 'red');
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
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        resetRegistrationMessage();

        if (newPassword !== confirmPassword) {
            displayRegistrationMessage(PASSWORD_MISMATCH_MESSAGE, 'red');
        } else {
            displayRegistrationMessage(REGISTRATION_SUCCESS_MESSAGE, 'green');
            setTimeout(() => {
                togglePopup(registrationPopupDiv, overlayRegistrationDiv, false); // Close the registration popup
            }, 2000); // Close after 2 seconds
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
    navButtons.style.display = 'none'; // Hide Login/Register buttons
    userAccountSpan.textContent = `Hi, ${username}`; // Display user's name
    userAccountSpan.style.display = 'inline'; // Make the user account span visible
    logoutButton.style.display = 'inline'; // Show the logout button
}
    
    // Simulate user logout
    function simulateLogout() {
        navButtons.style.display = 'block'; // Show Login/Register buttons
        userAccountSpan.style.display = 'none';
        userAccountSpan.textContent = '';
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
