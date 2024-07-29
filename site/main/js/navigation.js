function updateBasketIcon() {
    fetch('/order/basket')
        .then(response => response.json())
        .then(data => {
            const basket = data.basket;
            const basketIconText = document.querySelectorAll('.basket-size-text');

            basketIconText.forEach(iconText => {

                iconText.innerHTML = Object.keys(basket).length;
                console.log(basket);

            })

            
        })
        .catch(error => {
            console.error('Error fetching basket:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {

    // TEMPORARY
    updateBasketIcon()
    
});