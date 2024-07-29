function checkMessagesLength() {

    const messageContainer = document.querySelector('#messageBoxContainer');
    const messages = messageContainer.querySelectorAll('.popup-message-main.active');


    if (messages.length > 3) {

        messages[0].remove();

    }

}

function removeMessageTimeout(message) {

    message.remove();

}

function showMessage(title, body) {
    const messageBox = document.querySelector('.popup-message-main');
    const messageBoxClone = messageBox.cloneNode(true);
    messageBoxClone.classList.add('active');
    const messageTitle = messageBoxClone.querySelector('.message-title');
    const messageBody = messageBoxClone.querySelector('.message-body');
    
    messageTitle.innerHTML = title;
    messageBody.innerHTML = body;

    messageBoxClone.style.display = 'flex';

    

    document.querySelector('#messageBoxContainer').appendChild(messageBoxClone);

    checkMessagesLength()

    let timer = setTimeout(removeMessageTimeout, 5000, messageBoxClone);

    const closeButton = messageBoxClone.querySelector('.close-message-container');
    closeButton.addEventListener('click', () => {

        messageBoxClone.remove();

        clearTimeout(timer);

    })

    
    
}