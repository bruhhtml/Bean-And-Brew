function removeItemFromBasket(productID) {
    fetch('/order/basket/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productID })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Item removed from basket:', data);
        updateBasketDisplay();
    })
    .catch(error => {
        console.error('Error removing item from basket:', error);
    });
}

async function clearBasket() {

    fetch('/order/basket/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Basket Cleared');
        updateBasketDisplay();
    })
    .catch(error => {
        console.error('Error clearing basket');
    });

}

function updateBasketDisplay() {
    fetch('/order/basket')
        .then(response => response.json())
        .then(data => {
            const basket = data.basket;

            const basketIcon = document.querySelector('.basket-size-display');
            const basketIconText = basketIcon.querySelector('.basket-size-text');
            basketIconText.innerHTML = Object.keys(basket).length;

            const basketContainer = document.querySelector('.basket-container');
            if (Object.keys(basket).length > 0) {
                basketContainer.innerHTML = '';
            } else {

                basketContainer.innerHTML = `<p>Basket is empty</p>`;

            }
            

            let finalTotal = 0;

            Object.keys(basket).forEach(productId => {
                let itemTotal = basket[productId].productPrice;

                const item = basket[productId];
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('order-item');

                const deleteRow = document.createElement('div');
                deleteRow.classList.add('delete-row-button');

                deleteRow.innerHTML = 'Remove';
                deleteRow.addEventListener('click', () => {
                    removeItemFromBasket(productId);
                });

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('order-item-details');

                const quantityDisplay = document.createElement('p');
                quantityDisplay.classList.add('order-item-qty');
                quantityDisplay.innerHTML = basket[productId].quantity;

                const itemName = document.createElement('p');
                const itemDetails = document.createElement('ul');
                itemName.classList.add('item-name');
                itemDetails.classList.add('item-details');
                itemName.innerHTML = item.productName;

                const customisations = basket[productId].customisations;

                Object.keys(customisations).forEach(customisation => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${customisation}: ${customisations[customisation].optionName},`;
                    itemDetails.appendChild(listItem);
                    itemTotal += customisations[customisation].price;
                });

                finalTotal += itemTotal * basket[productId].quantity;

                const priceListItem = document.createElement('p');
                priceListItem.classList.add('productCost');
                priceListItem.innerHTML = `£${itemTotal.toFixed(2)}`;

                detailsDiv.appendChild(itemName);
                detailsDiv.appendChild(itemDetails);
                detailsDiv.appendChild(priceListItem);
                itemDiv.appendChild(deleteRow);
                itemDiv.appendChild(detailsDiv);
                itemDiv.appendChild(quantityDisplay);
                basketContainer.appendChild(itemDiv);
            });

            const finalTotalDisplay = document.querySelector('.order-sub-headers .total');
            finalTotalDisplay.innerHTML = `£${finalTotal.toFixed(2)}`;

            console.log(basket);
        })
        .catch(error => {
            console.error('Error fetching basket:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.detail-entry');
    const stages = form.querySelectorAll('.stage');
    const controls = document.querySelector('.details-entry-main .form-controls');
    const next = controls.querySelector('.call-to-action.next');
    const back = controls.querySelector('.call-to-action.back');

    const formProgress = document.querySelector('.form-stages');
    const progressStages = formProgress.querySelectorAll('.stage');

    let currentStage = 0;

    let formData = {}; 


    function collectData(stageIndex) {
        const inputs = stages[stageIndex].querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
    }

    // Function to populate the summary stage
    function populateSummary() {
        const summaryContainer = stages[2].querySelector('.customer-details-summary');
        summaryContainer.innerHTML = `
            <h3 style="font-size: 22px">Summary</h3>
            <div class="detail-summary-flex-container">
                <div>
                    <p><strong>First Name:</strong> ${formData['firstName']}</p>
                    <p><strong>Last Name:</strong> ${formData['lastName']}</p>
                    <p><strong>Email:</strong> ${formData['email']}</p>
                    <p><strong>Contact Number:</strong> ${formData['phone']}</p>
                </div>
                <div>
                    ${formData['isDelivery'] ? `
                        <h4>Delivery Address:</h4>
                        <p><strong>Address Line 1:</strong> ${formData['address1']}</p>
                        <p><strong>Address Line 2:</strong> ${formData['address2']}</p>
                        <p><strong>Town/City:</strong> ${formData['townCity']}</p>
                        <p><strong>County:</strong> ${formData['county']}</p>
                        <p><strong>Post Code:</strong> ${formData['postCode']}</p>
                    ` : `
                        <h4></h4>
                        <p><strong>Visit Date:</strong> ${formData['visitDate']}</p>
                        <p><strong>Party Size:</strong> ${formData['partySize']}</p>
                    `}
                    <p><strong>Store:</strong> ${formData['store']}</p>
                </div>
            </div>
            
            
        `;
    }

    document.querySelector('.call-to-action.next').addEventListener('click', async function () {
        if (currentStage < stages.length - 1) {
            collectData(currentStage); // Collect data from the current stage
            stages[currentStage].classList.remove('current');
            currentStage += 1;
            progressStages[currentStage].classList.add('current');
            stages[currentStage].classList.add('current');
            
            if (currentStage === stages.length - 1) {
                populateSummary(); // Populate summary in the last stage
                next.querySelector('div p').innerHTML = 'Submit';
            }
        } else {
            let firstName = document.querySelector("#orderCustomerInfo #firstName");
            let lastName = document.querySelector("#orderCustomerInfo #lastName");
            let email = document.querySelector("#orderCustomerInfo #email");
            let phone = document.querySelector("#orderCustomerInfo #phone");

            const response = await fetch(`/create-order/${firstName.value}/${lastName.value}/${email.value}/${phone.value}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {

                const errorData = await response.json();
                errormessage.textContent = errorData.error;

            } else {

                await clearBasket();

                window.location.href = "/account";

            }

        }

        if (currentStage > 0) {
            back.classList.add('active');
        }
    });

    document.querySelector('.call-to-action.back').addEventListener('click', function () {
        if (currentStage > 0) {
            stages[currentStage].classList.remove('current');
            progressStages[currentStage].classList.remove('current');
            currentStage -= 1;
            stages[currentStage].classList.add('current');
            
            if (currentStage === 0) {
                back.classList.remove('active');
            }
            
            if (currentStage < stages.length - 1) {
                next.querySelector('div p').innerHTML = 'Next';
            }
        }
    });


    // Load basket from server when page loads
    updateBasketDisplay();
});
