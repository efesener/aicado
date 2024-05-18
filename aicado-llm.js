(function () {
    var chatPosition = window.chatPosition;
    var chatBalloonImg = window.chatBalloonImg;

    var greetings = window.greetings;

    var style = document.createElement('style');
    var buttonPositionStyle = chatPosition === 'right-bottom' ? 'right: 20px;' : 'left: 20px;';
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
            bottom: 20px;
            ${buttonPositionStyle}
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 30px;
            z-index: 1001;
        }

        #chatbotContainer {
            width: 440px; 
            height: 540px;
            position: fixed;
            bottom: 90px;
            ${buttonPositionStyle}
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
            position: fixed; /* Make it fixed to float like chatbotButton */
            background-color: var(--aicado-greetings-bg);
            color: var(--aicado-greetings-color);
            border-radius: var(--aicado-greetings-border-radius);
            padding: var(--aicado-greetings-padding);
            margin-bottom: 5px;
            opacity: 0;                
            transform: translateY(20px); 
            transition: transform var(--aicado-greetings-transition-duration) ease-in-out, opacity var(--aicado-greetings-transition-duration) ease-in-out;

            font-family: var(--aicado-greetings-font-family);
            font-size: var(--aicado-greetings-font-size);
            max-width: var(--aicado-greetings-max-width);
            z-index: 1002; 
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

    var srcIframe = window.chatbotIframeSrc;

    chatbotIframe.src = srcIframe;
    chatbotContainer.appendChild(chatbotIframe);

    // Create message boxes for each greeting
    if (greetings[0]) {
        greetings.forEach((text, index) => {
            var aicadoMessageBox = document.createElement('div');
            aicadoMessageBox.innerText = text;
            aicadoMessageBox.className = 'aicadoMessageBox';
            aicadoMessageBox.id = `aicadoMessageBox-${index}`;
            document.body.appendChild(aicadoMessageBox);
        });
    }
    // Function to update position of message boxes relative to chatbot button
    function updateMessagePositions() {
        const rect = chatbotButton.getBoundingClientRect();
        let totalHeight = 0;
        const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--aicado-greetings-gap')); // Fixed gap between message boxes

        greetings.forEach((text, index) => {
            const aicadoMessageBox = document.getElementById(`aicadoMessageBox-${index}`);
            if (chatPosition === 'right-bottom') {
                aicadoMessageBox.style.right = `${window.innerWidth - rect.right - 15}px`;
                aicadoMessageBox.style.left = 'auto'; // Reset left to auto
            } else {
                aicadoMessageBox.style.left = `${rect.left}px`;
                aicadoMessageBox.style.right = 'auto'; // Reset right to auto
            }

            aicadoMessageBox.style.bottom = `${window.innerHeight - rect.top + totalHeight + gap}px`;

            // Calculate new bottom position with fixed gap
            totalHeight += aicadoMessageBox.offsetHeight + gap; // Update total height with current message box height + fixed gap
        });
    }

    // Function to sequentially show message boxes with slide-in effect
    function showMessagesSequentially(index = 0) {
        if (index >= greetings.length) return;

        const aicadoMessageBox = document.getElementById(`aicadoMessageBox-${index}`);
        aicadoMessageBox.style.opacity = 1; // Show the message box
        aicadoMessageBox.style.transform = 'translateY(0)'; // Slide in from bottom to top

        setTimeout(() => {
            showMessagesSequentially(index + 1); // Show the next message box after a delay
        }, 1000); // Delay in milliseconds before showing the next message box
    }

    // Call function once initially & also whenever window resizes(for responsiveness)
    window.addEventListener('load', () => {
        updateMessagePositions();
        showMessagesSequentially(); // Start showing messages sequentially
    });
    window.addEventListener('resize', updateMessagePositions);

    chatbotButton.addEventListener('click', function () {
        var display = chatbotContainer.style.display;
        chatbotContainer.style.display = display === 'block' ? 'none' : 'block';

        document.querySelectorAll('.aicadoMessageBox').forEach(box => {
            box.remove();
        });

    });
})();