function addItemToBasket(product, selectedOptions, quantity) {
    fetch('/order/basket/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product, selectedOptions, quantity })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Item added to basket:', data);
        updateBasketIcon();
        showMessage('Item Added', product.productName + ' has been added to your basket.');
    })
    .catch(error => {
        console.error('Error adding item to basket:', error);
    });
}

function getBasket() {
    fetch('/order/basket')
    .then(response => response.json())
    .then(data => {
        console.log('Current basket:', data.basket);
        // Update your UI based on the basket state
    });
}


function loadProductInformation(product, category) {
    const popup = document.querySelector('.product-info-popup');
    popup.classList.add('active');

    const title = popup.querySelector('.product-title h3');
    const image = popup.querySelector('.product-image');
    const customizationsDiv = popup.querySelector('.product-customisation');
    const basePriceDiv = popup.querySelector('.charge.base-price .charge-price');
    const totalPriceDiv = popup.querySelector('.charge.total .charge-price');
    const chargesDiv = popup.querySelector('.charges');
    
    title.innerHTML = product.productName;
    image.style.backgroundImage = `url('../media/category-${category.toLowerCase().replace(" ", "-")}-image.png')`;

    let basePrice = product.productPrice;
    basePriceDiv.innerHTML = `£${basePrice.toFixed(2)}`;
    let totalPrice = basePrice;
    
    customizationsDiv.innerHTML = '';
    chargesDiv.innerHTML = '';

    const customisationsHeadingHTML = document.createElement('h4');
    customisationsHeadingHTML.textContent = "Customise your drink!"

    customizationsDiv.appendChild(customisationsHeadingHTML);

    let selectedOptions = {};

    // Function to update the charges display
    function updateCharges() {
        const addToCart = document.querySelector(".add-to-cart-section");
        const quantityDisplay = addToCart.querySelector(".qtyDisplay p");
        const currentQty = Number(quantityDisplay.innerHTML);

        chargesDiv.innerHTML = '';
        totalPrice = basePrice * currentQty;

        Object.keys(selectedOptions).forEach(category => {
            const option = selectedOptions[category];

            if (option.price > 0) {
                totalPrice += option.price;

                const priceText = option.price * currentQty < 1 ? `${((option.price * 100) * currentQty).toFixed(0)}p` : `£${(option.price * currentQty).toFixed(2)}`;
                const chargeDiv = document.createElement('div');
                chargeDiv.classList.add('charge');

                chargeDiv.innerHTML = `
                    <p class="charge-name">${option.optionName}</p>
                    <p class="charge-price">${priceText}</p>
                `;

                chargesDiv.appendChild(chargeDiv);
            }
        });

        totalPriceDiv.innerHTML = `£${totalPrice.toFixed(2)}`;
    }

    product.customizations.forEach(customization => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('customise-options');
        categoryDiv.setAttribute('name', customization.name);

        const categoryTitle = document.createElement('h5');
        categoryTitle.textContent = customization.name;
        categoryDiv.appendChild(categoryTitle);

        customization.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.dataset.price = option.price; // Store price in data attribute

            const priceText = option.price < 1 ? `${(option.price * 100).toFixed(0)}p` : `£${option.price.toFixed(2)}`;

            const priceDiv = document.createElement('div');
            priceDiv.classList.add('price');
            const priceDivText = document.createElement('p');
            priceDivText.textContent = priceText;
            priceDiv.appendChild(priceDivText)
            

            const optionLabel = document.createElement('h6');
            optionLabel.textContent = option.optionName;

            optionDiv.appendChild(priceDiv);
            optionDiv.appendChild(optionLabel);

            optionDiv.addEventListener('click', () => {
                // Deselect other options in the same category
                const options = categoryDiv.querySelectorAll('.option');
                options.forEach(opt => opt.classList.remove('selected'));

                // Select this option
                optionDiv.classList.add('selected');

                // Update selected options
                selectedOptions[customization.name] = {
                    optionName: option.optionName,
                    price: option.price
                };

                // Update the charges display
                updateCharges();
            });

            categoryDiv.appendChild(optionDiv);

            // Select the first option by default
            if (index === 0) {
                selectedOptions[customization.name] = {
                    optionName: option.optionName,
                    price: option.price
                };
                optionDiv.classList.add('selected');
            }
        });

        customizationsDiv.appendChild(categoryDiv);
    });

    
    const addToCart = document.querySelector(".add-to-cart-section");

    const subtract = addToCart.querySelector(".quantity .subtract");
    const add = addToCart.querySelector(".quantity .add");
    const addToCartButton = addToCart.querySelector('.add-to-order');

    const quantityDisplay = addToCart.querySelector(".qtyDisplay p");
    quantityDisplay.innerHTML = String(1);

    subtract.replaceWith(subtract.cloneNode(true));
    add.replaceWith(add.cloneNode(true));
    addToCartButton.replaceWith(addToCartButton.cloneNode(true));

    const newSubtract = addToCart.querySelector(".quantity .subtract");
    const newAdd = addToCart.querySelector(".quantity .add");
    const newAddToCartButton = addToCart.querySelector('.add-to-order');

    newSubtract.addEventListener('click', (event) => {
        const currentQty = Number(quantityDisplay.innerHTML);

        if (currentQty - 1 > 0) {
            quantityDisplay.innerHTML = String(currentQty - 1);
            newAdd.classList.remove('maxed');
            updateCharges();
        }

        if (currentQty - 1 == 1) {
            newSubtract.classList.add('maxed');
        }
    }, false);
    
    newAdd.addEventListener('click', (event) => {
        const currentQty = Number(quantityDisplay.innerHTML);

        if (currentQty + 1 <= 100) {
            quantityDisplay.innerHTML = String(currentQty + 1);
            newSubtract.classList.remove('maxed');
            updateCharges();
        }

        if (currentQty + 1 == 100) {
            newAdd.classList.add('maxed');
        }
    });

    newAddToCartButton.addEventListener('click', () => {
        const quantity = Number(document.querySelector(".add-to-cart-section .qtyDisplay p").innerHTML);
        console.log(product);
        addItemToBasket(product, selectedOptions, quantity);
    });

    updateCharges();

    totalPriceDiv.innerHTML = `£${totalPrice.toFixed(2)}`;
}

async function loadProducts() {
    try {
        const response = await fetch('/products');
        const products = await response.json();

        const productMenu = document.getElementById('product-menu');
        const categories = {};

        products.forEach(product => {
            if (!categories[product.productCategory]) {
                categories[product.productCategory] = [];
            }
            categories[product.productCategory].push(product);
        });

        for (const category in categories) {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('menu-item-category');
            categoryDiv.setAttribute('id', `menu-${category.toLowerCase()}`)

            const categoryHeading = document.createElement('div');
            categoryHeading.classList.add('item-category-heading');
            categoryHeading.innerHTML = `<h3>${category}</h3>`;
            categoryDiv.appendChild(categoryHeading);

            const categoryItems = document.createElement('div');
            categoryItems.classList.add('menu-category-items');

            categories[category].forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('item');
                productItem.innerHTML = `
                    <div class="image" style="background-image: url('../media/category-${category.toLowerCase().replace(" ", "-")}-image.png');"></div>
                    <h6 class="title">${product.productName}</h6>
                    <p class="price">£${product.productPrice.toFixed(2)}</p>
                `;
                productItem.addEventListener('click', () => {
                    loadProductInformation(product, category);
                });
                categoryItems.appendChild(productItem);
            });

            categoryDiv.appendChild(categoryItems);
            productMenu.appendChild(categoryDiv);
        }

    } catch (error) {
        console.error('Error loading products:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = `menu-${category.getAttribute('href').substring(1).toLowerCase()}`;
            console.log(targetId)


            const element = document.getElementById(targetId);
            const offset = 500;
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const offsetPosition = absoluteElementTop - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
    
});