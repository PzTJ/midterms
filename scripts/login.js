document.addEventListener('DOMContentLoaded', () => {
    const loginFormPanel = document.querySelector('.login-form-panel');
    const loginImagePanel = document.getElementById('login-image-panel');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const activeIndicator = document.querySelector('.active-indicator');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');
    const userInfoUsername = document.getElementById('user-info-username');
    const userInfoPhone = document.getElementById('user-info-phone');
    const logoutBtn = document.getElementById('logout-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const userInfoMessage = document.getElementById('user-info-message');
  
    const USER_ACCOUNTS_KEY = 'userAccounts';
    const LOGGED_IN_USER_KEY = 'loggedInUser';
    const IMAGE_BASE = 'images/login_bg';
    const IMAGE_COUNT = 5;
  
    const getAccounts = () => JSON.parse(localStorage.getItem(USER_ACCOUNTS_KEY) || '{}');
    const saveAccounts = (accounts) => localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
    const clearMessage = (element) => displayMessage(element, '', 'info');
  
    function displayMessage(element, message, type = 'info') {
      if (!element) return;
      element.textContent = message;
      element.className = `form-message ${type}`;
    }
  
    function setBackgroundImage() {
      let visitCount = parseInt(localStorage.getItem('loginVisitCount') || '0') + 1;
      localStorage.setItem('loginVisitCount', visitCount);
      const imageIndex = (visitCount % IMAGE_COUNT) + 1;
      loginImagePanel && (loginImagePanel.style.backgroundImage = `url('${IMAGE_BASE}${imageIndex}.jpg')`);
    }
  
    function showUserInfo(username) {
      const accounts = getAccounts();
      const user = accounts[username];
      if (user) {
        userInfoUsername.textContent = username;
        userInfoPhone.textContent = user.phone || 'Not available';
        loginFormPanel.classList.add('logged-in');
        clearMessage(userInfoMessage);
      } else {
        console.error('User data not found:', username);
        logout();
      }
    }
  
    function showAuthForms() {
      loginFormPanel.classList.remove('logged-in');
      switchForm(true);
    }
  
    function switchForm(showLogin) {
      if (loginFormPanel.classList.contains('logged-in')) return;
  
      loginForm?.classList.toggle('active-form', showLogin);
      registerForm?.classList.toggle('active-form', !showLogin);
      showLoginBtn?.classList.toggle('active', showLogin);
      showRegisterBtn?.classList.toggle('active', !showLogin);
      activeIndicator?.classList.toggle('show-register', !showLogin);
      clearMessage(loginMessage);
      clearMessage(registerMessage);
    }
  
    showLoginBtn?.addEventListener('click', () => switchForm(true));
    showRegisterBtn?.addEventListener('click', () => switchForm(false));
  
    forgotPasswordLink?.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('This is only a simulation, so unfortunately we are unable to offer this service right now.\n\nHowever, you can wipe out the localStorage, clearing all simulated accounts!\n\nDelete all accounts?')) {
        localStorage.removeItem(USER_ACCOUNTS_KEY);
        alert('All simulated accounts have been deleted from localStorage.');
        displayMessage(loginMessage, 'Accounts cleared.', 'info');
      }
    });
  
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage(loginMessage);
  
      const { username, password } = loginForm.elements;
      if (!username.value.trim() || !password.value) {
        return displayMessage(loginMessage, 'Please enter username and password.', 'error');
      }
  
      const user = getAccounts()[username.value];
      if (user && user.password === password.value) {
        sessionStorage.setItem(LOGGED_IN_USER_KEY, username.value);
        showUserInfo(username.value);
        loginForm.reset();
      } else {
        displayMessage(loginMessage, 'Invalid username or password.', 'error');
      }
    });
  
    registerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage(registerMessage);
  
      const { phone, username, password, repeatPassword } = registerForm.elements;
      if (!phone.value.trim() || !username.value.trim() || !password.value || !repeatPassword.value) {
        return displayMessage(registerMessage, 'All fields are required.', 'error');
      }
      if (password.value !== repeatPassword.value) {
        return displayMessage(registerMessage, 'Passwords do not match.', 'error');
      }
      if (getAccounts()[username.value]) {
        return displayMessage(registerMessage, 'Username already exists.', 'error');
      }
  
      const accounts = getAccounts();
      accounts[username.value] = { password: password.value, phone: phone.value };
      saveAccounts(accounts);
  
      displayMessage(registerMessage, 'Registration successful! You can now log in.', 'success');
      registerForm.reset();
      setTimeout(() => switchForm(true), 1500);
    });
  
    function logout() {
      sessionStorage.removeItem(LOGGED_IN_USER_KEY);
      showAuthForms();
    }
    logoutBtn?.addEventListener('click', logout);
  
    deleteAccountBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const user = sessionStorage.getItem(LOGGED_IN_USER_KEY);
        if (user) {
          const accounts = getAccounts();
          delete accounts[user];
          saveAccounts(accounts);
          displayMessage(userInfoMessage, 'Account deleted successfully.', 'success');
          logout();
        } else {
          console.error('No user to delete.');
          logout();
        }
      }
    });
  
    const handleEnterKey = (e, form) => e.key === 'Enter' && (e.preventDefault(), form.dispatchEvent(new Event('submit')));
    loginForm?.querySelectorAll('input').forEach(input => input.addEventListener('keydown', (e) => handleEnterKey(e, loginForm)));
    registerForm?.querySelectorAll('input').forEach(input => input.addEventListener('keydown', (e) => handleEnterKey(e, registerForm)));
  
    sessionStorage.getItem(LOGGED_IN_USER_KEY) ? showUserInfo(sessionStorage.getItem(LOGGED_IN_USER_KEY)) : showAuthForms();
    setBackgroundImage();
  });