const menu = document.getElementById('product-menu');
const items = menu.getElementsByClassName('item');
const popup = document.querySelector('.product-info-popup');
const closePopup = popup.querySelector('.close-popup');

closePopup.addEventListener('click', () => {

    popup.classList.remove('active');

})