const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const formSignup = document.getElementById('signup-form');
const formLogin = document.getElementById('login-form');

/**
 * Redirects the signed up or logged in user based on the server response
 */
const isAdmin = () => {
  fetch(`${baseUrl}/requests`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.token}` },
  }).then(response => response.json()).then((response) => {
    if (response.status === 'fail') window.location.replace('user.html');
    if (response.status === 'success') window.location.replace('admin.html');
  }).catch(() => {
    displayAlert('Error connecting to the network, please check your Internet connection and try again');
  });
};

/**
 * Assigns an event-listener to formSignup if it exists in the window
 *
 * @param {object} submitEvent - The event parameter
 */
if (formSignup) {
  formSignup.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      displayAlert('Passwords do not match', 3);
    } else {
      fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
          firstname, lastname, email, password,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()).then((response) => {
        if (response.code === 201) {
          window.localStorage.token = response.token;
          displayAlert(`Welcome ${response.data.fullname}, your signup was Successful`, 2);
          setTimeout(() => {
            window.location.replace('user.html');
          }, 10);
        } else {
          displayAlert(response.message, 3);
        }
      }).catch(() => {
        displayAlert('Error connecting to the network, please check your Internet connection and try again');
      });
    }
  });
}

/**
 * Assigns an event-listener to formLogin if it exists in the window
 *
 * @param {object} submitEvent - The event parameter
 */
if (formLogin) {
  formLogin.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then((response) => {
      if (response.code === 200) {
        window.localStorage.token = response.token;
        displayAlert('Welcome, your login was Successful', 2);
        isAdmin();
      } else {
        displayAlert(response.message, 3);
      }
    }).catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
  });
}
