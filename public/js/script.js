const apiBaseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const btnMenu = document.getElementById('menu');
const btnCreateRequest = document.getElementById('btn-add-request');
const btnCloseCreateRequest = document.getElementById('btn-close-add-request');
const btnCloseUpdateRequest = document.getElementById('btn-close-update-request');
const btnCloseViewRequest = document.getElementById('btn-close-view-request');
const btnLogOut = document.getElementById('logout');
const indexPage = document.getElementById('index-page');
const sideNav = document.getElementById('side-nav');

/**
 * Toggles Modals
 *
 * @param {string} id - The id of the Modal to be toggled
 */
const toggleModal = (id) => {
  if (document.getElementById('modal').style.display === 'block') {
    document.getElementById('modal').style.display = 'none';
    document.getElementById(id).style.display = 'none';
  } else {
    document.getElementById('modal').style.display = 'block';
    document.getElementById(id).style.display = 'block';
  }
};

/**
 * Displays a custom message
 *
 * @param {string} message - The message to be displayed on the alert
 */
const displayAlert = (message, type = 1) => {
  document.getElementById('display').className = 'show';
  const alert = document.getElementById('alert');
  switch (type) {
    case 2:
      document.getElementById('display').style.backgroundColor = '#2ecc71';
      alert.innerHTML = message;
      break;
    case 3:
      document.getElementById('display').style.backgroundColor = '#E74C3C';
      alert.innerHTML = message;
      break;
    default:
      document.getElementById('display').style.backgroundColor = '#3498db';
      alert.innerHTML = message;
      break;
  }
  setTimeout(() => {
    document.getElementById('display').className = '';
  }, 4000);
};

const userLoggedIn = () => {
  fetch(`${apiBaseUrl}/auth/account`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.token}` },
  }).then(response => response.json()).then((response) => {
    const indexNav = document.getElementById('nav');
    switch (response.code) {
      case 200:
        indexNav.innerHTML = '<li><a href="admin.html"><button class="ch-btn-round"> Dashboard </button></a></li><li><button class="ch-btn-round" id="logout"> Logout </button></li>';
        break;
      case 403:
        indexNav.innerHTML = '<li><a href="admin.html"><button class="ch-btn-round"> Dashboard </button></a></li><li><button class="ch-btn-round" id="logout"> Logout </button></li>';
        break;
      default:
        indexNav.innerHTML = '<li><a href="signin.html"><button class="ch-btn-round"> Login </button></a></li><li><a href="signup.html"><button class="ch-btn-round"> Signup </button></a></li>';
        break;
    }
  }).catch(() => {
    displayAlert('Error connecting to the network, please check your Internet connection and try again');
  });
};

/**
 * Toggles the navigation bar on small devices
 */
const toggleMenu = () => {
  const width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
  if (document.getElementById('nav').style.display === 'none') {
    document.getElementById('nav').style.display = 'block';
    if (sideNav && width < 769) sideNav.style.width = '85%';
  } else {
    document.getElementById('nav').style.display = 'none';
    if (sideNav && width < 769) sideNav.style.width = '0px';
  }
};

if (btnMenu) {
  btnMenu.addEventListener('click', () => {
    toggleMenu();
  });
}

if (btnCreateRequest) {
  btnCreateRequest.addEventListener('click', () => toggleModal('add-request'));
}

if (btnCloseCreateRequest) {
  btnCloseCreateRequest.addEventListener('click', () => toggleModal('add-request'));
}

if (btnCloseUpdateRequest) {
  btnCloseUpdateRequest.addEventListener('click', () => toggleModal('update-request'));
}

if (btnCloseViewRequest) {
  btnCloseViewRequest.addEventListener('click', () => toggleModal('view-request'));
}

if (btnLogOut) {
  btnLogOut.addEventListener('click', () => {
    localStorage.token = 'empty';
    document.location.replace('index.html');
  });
}

if (indexPage) {
  indexPage.addEventListener('load', () => userLoggedIn());
}

/**
 * Removes the style attributes from responsive elemnts when the screen size changes,
 * this enables the elements to fallback to external styling
 */
const resize = () => {
  const width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
  if (width > 769) {
    document.getElementById('nav').removeAttribute('style');
    document.getElementById('side-nav').removeAttribute('style');
  }
};
