const btnMenu = document.getElementById('menu');
const btnCreateRequest = document.getElementById('btn-add-request');
const btnCloseCreateRequest = document.getElementById('btn-close-add-request');
const btnCloseViewRequest = document.getElementById('btn-close-view-request');

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

if (btnMenu) {
  /**
 * Toggles the navigation bar on small devices
 */
  btnMenu.addEventListener('click', () => {
    if (document.getElementById('nav').style.display === 'none') {
      document.getElementById('nav').style.display = 'block';
    } else {
      document.getElementById('nav').style.display = 'none';
    }
  });
}

if (btnCreateRequest) {
  btnCreateRequest.addEventListener('click', () => toggleModal('add-request'));
}

if (btnCloseCreateRequest) {
  btnCloseCreateRequest.addEventListener('click', () => toggleModal('add-request'));
}

if (btnCloseViewRequest) {
  btnCloseViewRequest.addEventListener('click', () => toggleModal('add-request'));
}

/**
 * Displays a custom message
 *
 * @param {string} message - The message to be displayed on the alert
 */
const displayAlert = (message) => {
  document.getElementById('display').style.display = 'block';
  document.getElementById('alert').innerHTML = message;
  setTimeout(() => {
    document.getElementById('display').style = 'none';
  }, 4000);
};
