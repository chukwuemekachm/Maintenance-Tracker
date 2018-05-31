const baseUrl = 'http://localhost:3000/api/v1';
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
  }).catch((error) => {
    displayAlert(`Welcome ${error.message}, your login failed`);
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

    fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({
        firstname, lastname, email, password,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then((response) => {
      if (response.code === 201) {
        window.localStorage.token = response.token;
        displayAlert(`Welcome ${response.data.fullname}, your signup was Successful`);
        setTimeout(() => {
          window.location.replace('user.html');
        }, 3000);
      } else {
        displayAlert(response.message);
      }
    }).catch((error) => { displayAlert(error.message); });
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
        displayAlert('Welcome, your login was Successful');
        isAdmin();
      } else {
        displayAlert(response.message);
      }
    }).catch((error) => {
      displayAlert(`${error.message}, your login failed`);
    });
  });
}
