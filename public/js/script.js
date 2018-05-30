const btnMenu = document.getElementById('menu');

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
