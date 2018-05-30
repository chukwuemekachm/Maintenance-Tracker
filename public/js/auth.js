const baseUrl = 'http://localhost:3000/api/v1';
const formSignup = document.getElementById('signup-form');

/**
 * Redirects the signed up or logged in user based on the server response
 */
const isAdmin = () => {
  fetch(`${baseUrl}/requests`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.token}` },
    mode: 'cors',
    cache: 'reload',
    redirect: 'follow',
  })
    .then(res => res.json())
    .then((res) => {
      if (res.code === 403) window.location.replace('user.html');
      if (res.code === 200) window.location.replace('admin.html');
    }).catch((err) => {
      displayAlert(`Welcome ${err.message}, your login failed`, 2);
    });
};

/**
 * Assigns an event-listener to formSignup if it exists
 *
 * @param {object} message - The event parameter
 */
if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (firstname && lastname && email && password) {
      const body = {
        firstname, lastname, email, password,
      };
      fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        cache: 'reload',
        redirect: 'follow',
      }).then(res => res.json()).then((res) => {
        if (res.code === 201) {
          window.localStorage.token = res.token;
          displayAlert(`Welcome ${res.data.fullname}, your signup was Successful`, 1);
          setTimeout(() => {
            window.location.replace('user.html');
          }, 3000);
        }
        displayAlert(res.message, 2);
      })
        .catch((err) => { displayAlert(err.message, 1); });
    } else {
      displayAlert('Please fill in the form', 2);
    }
  });
}
