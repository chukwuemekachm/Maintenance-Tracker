const btnMenu = document.getElementById('menu');

if (btnMenu) {
  btnMenu.addEventListener('click', () => {
    if (document.getElementById('nav').style.display === 'none') {
      document.getElementById('nav').style.display = 'block';
    } else {
      document.getElementById('nav').style.display = 'none';
    }
  });
}
