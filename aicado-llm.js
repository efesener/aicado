(function () {
    var chatPosition = window.chatPosition;
    var chatBalloonImg = window.chatBalloonImg;

    var greetings = window.greetings;

// Check if we should show the greetings based on localStorage value
var showGreetings = localStorage.getItem('aicado-show-greetings') !== 'false';

var style = document.createElement('style');

style.innerHTML = `
    :root {
        --aicado-greetings-font-size: 14px;
        --aicado-greetings-padding: 10px;
        --aicado-greetings-border-radius: 10px;
        --aicado-greetings-max-width: 250px;
        --aicado-greetings-transition-duration: 0.5s;
        --aicado-greetings-gap: 10px;
    }

    #chatbotButton {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: transparent;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('${chatBalloonImg}');
        position: fixed;
        bottom: var(--aicado-button-bottom-pos, 20px);
        ${chatPosition === 'right-bottom' ? 'right: var(--aicado-button-side-pos, 20px);' : ''}
        ${chatPosition === 'left-bottom' ? 'left: var(--aicado-button-side-pos, 20px);' : ''}
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 30px;
        z-index: 999999;
    }

    #chatbotContainer {
        background: #fff;
        width: 440px; 
        height: 640px;
        position: fixed;
        bottom: var(--aicado-button-bottom-pos, 20px);
        ${chatPosition === 'right-bottom' ? 'right: var(--aicado-button-side-pos, 20px);' : ''}
        ${chatPosition === 'left-bottom' ? 'left: var(--aicado-button-side-pos, 20px);' : ''}
        border: 1px solid #ccc;
        box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 3px;
        display: none;
        z-index: 999999;
        border-radius: 12px;
    }

    #chatbotIframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 12px;
    }

    @media (max-width: 540px) {
        #chatbotContainer {
            width: calc(100% - 40px); 
            left: 20px;
            right: 20px;
        }
    }

    /* Styles for the message box */
    .aicadoMessageBox {
        position: fixed;
        background-color: var(--aicado-greetings-bg, #F5F5F5);
        color: var(--aicado-greetings-color, #252525);
        border-radius: var(--aicado-greetings-border-radius);
        padding: var(--aicado-greetings-padding);
        margin-bottom: 5px;
        opacity: 0;                
        transform: translateY(20px); 
        transition: transform var(--aicado-greetings-transition-duration) ease-in-out, opacity var(--aicado-greetings-transition-duration) ease-in-out;
        font-family: var(--aicado-greetings-font-family, "Inter"), var(--aicado-greetings-font-type, sans-serif);
        font-size: var(--aicado-greetings-font-size);
        max-width: var(--aicado-greetings-max-width);
        z-index: 1002; 
    }

    .close-icon-container {
        position: absolute;
        top: -25px;
        width: 20px;
        height: 20px;
        background-color: var(--aicado-greetings-bg, #F5F5F5);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .close-icon {
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
        color: var(--aicado-greetings-color, #252525);
    }

    /* New styles for chatbot close icon */
    .chatbot-close-icon {
        position: absolute;
        top: 18px;
        right: 14px;
        width: 24px;
        height: 24px;
        background-color: #FFF;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 1003;
    }

    .chatbot-close-icon span {
        font-size: 18px;
        line-height: 25px;
        margin-left: 1px;
        color: #000;
        width: 100%;
        height: 100%;
        text-align: center;
    }
`;
document.head.appendChild(style);

var chatbotButton = document.createElement('div');
chatbotButton.id = 'chatbotButton';
document.body.appendChild(chatbotButton);

var chatbotContainer = document.createElement('div');
chatbotContainer.id = 'chatbotContainer';
document.body.appendChild(chatbotContainer);

var chatbotIframe = document.createElement('iframe');
chatbotIframe.id = 'chatbotIframe';

// Add the allow attribute here
chatbotIframe.allow = "clipboard-read; clipboard-write; microphone; camera";

var srcIframe = window.chatbotIframeSrc;

if (srcIframe.includes('?')) {
    srcIframe += "&chatBalloon=true";
} else {
    srcIframe += "?chatBalloon=true";
}

chatbotIframe.src = srcIframe;

chatbotContainer.appendChild(chatbotIframe);

// Create and append the close icon to chatbotContainer
var closeIconDiv = document.createElement('div');
closeIconDiv.className = 'chatbot-close-icon';
var closeIconSpan = document.createElement('span');
closeIconSpan.innerText = '×';
closeIconDiv.appendChild(closeIconSpan);
chatbotContainer.appendChild(closeIconDiv);

closeIconDiv.addEventListener('click', function() {
    chatbotContainer.style.display = 'none';
});

// Create message boxes for each greeting only if showGreetings is true
if (showGreetings && greetings[0]) {
    greetings.forEach((text, index) => {
        var aicadoMessageBox = document.createElement('div');
        aicadoMessageBox.innerText = text;
        aicadoMessageBox.className = 'aicadoMessageBox';
        aicadoMessageBox.id = `aicadoMessageBox-${index}`;

        // Add close icon only to the last message box
        if (index === greetings.length - 1) {
            var closeIconContainer = document.createElement('div');
            closeIconContainer.className = 'close-icon-container';

            // Position the close icon container based on chatPosition
            if (chatPosition === 'right-bottom') {
                closeIconContainer.style.right = '5px';
            } else {
                closeIconContainer.style.left = '5px';
            }

            var closeIcon = document.createElement('span');
            closeIcon.innerText = '×';
            closeIcon.className = 'close-icon';
            closeIcon.addEventListener('click', function() {
                localStorage.setItem('aicado-show-greetings', 'false');
                document.querySelectorAll('.aicadoMessageBox').forEach(box => {
                    box.remove();
                });
            });

            closeIconContainer.appendChild(closeIcon);
            aicadoMessageBox.appendChild(closeIconContainer);
        }

        document.body.appendChild(aicadoMessageBox);
    });
}

// Function to update position of message boxes relative to chatbot button
function updateMessagePositions() {
    const rect = chatbotButton.getBoundingClientRect();
    let totalHeight = 0;
    const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--aicado-greetings-gap'));

    greetings.forEach((text, index) => {
        const aicadoMessageBox = document.getElementById(`aicadoMessageBox-${index}`);
        if (chatPosition === 'right-bottom') {
            aicadoMessageBox.style.right = `${window.innerWidth - rect.right - 15}px`;
            aicadoMessageBox.style.left = 'auto';
        } else {
            aicadoMessageBox.style.left = `${rect.left}px`;
            aicadoMessageBox.style.right = 'auto';
        }

        aicadoMessageBox.style.bottom = `${window.innerHeight - rect.top + totalHeight + gap}px`;

        totalHeight += aicadoMessageBox.offsetHeight + gap;
    });
}

// Function to sequentially show message boxes with slide-in effect
function showMessagesSequentially(index = 0) {
    if (index >= greetings.length) return;

    const aicadoMessageBox = document.getElementById(`aicadoMessageBox-${index}`);
    aicadoMessageBox.style.opacity = 1;
    aicadoMessageBox.style.transform = 'translateY(0)';

    setTimeout(() => {
        showMessagesSequentially(index + 1);
    }, 1000);
}

// Call function once initially & also whenever window resizes(for responsiveness)
window.addEventListener('load', () => {
    if (showGreetings) {
        updateMessagePositions();
        showMessagesSequentially();
    }

    // Calculate max-height dynamically
    // Calculate max-height dynamically
    const viewportHeight = window.innerHeight;
    const computedStyle = getComputedStyle(document.documentElement);
    const buttonBottomPos = parseInt(computedStyle.getPropertyValue('--aicado-button-bottom-pos') || '20px');
    const calculatedMaxHeight = viewportHeight - buttonBottomPos - 20;

    // Set the max-height of chatbotContainer if it exceeds 640px
    const chatbotContainer = document.getElementById('chatbotContainer');
    if (calculatedMaxHeight < 640) {
        chatbotContainer.style.maxHeight = `${calculatedMaxHeight}px`;
    } else {
        chatbotContainer.style.height = '640px';
    }
});

window.addEventListener('resize', () => {
    updateMessagePositions();

    // Recalculate max-height on resize
    const viewportHeight = window.innerHeight;
    const computedStyle = getComputedStyle(document.documentElement);
    const buttonBottomPos = parseInt(computedStyle.getPropertyValue('--aicado-button-side-pos') || '20px');
    const calculatedMaxHeight = viewportHeight - buttonBottomPos - 20;

    // Update the max-height of chatbotContainer if it exceeds 640px
    const chatbotContainer = document.getElementById('chatbotContainer');
    if (calculatedMaxHeight < 640) {
        chatbotContainer.style.maxHeight = `${calculatedMaxHeight}px`;
    } else {
        chatbotContainer.style.height = '640px';
    }
});

chatbotButton.addEventListener('click', function () {
    var display = chatbotContainer.style.display;
    chatbotContainer.style.display = display === 'block' ? 'none' : 'block';

    document.querySelectorAll('.aicadoMessageBox').forEach(box => {
        box.remove();
    });
});
})();