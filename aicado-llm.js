(function() {
    var chatPosition = window.chatPosition; // Varsayılan değer, 'left-bottom' olarak da ayarlanabilir.
    var chatBalloonImg = window.chatBalloonImg;
  
    // Stilleri ekleyin
    var style = document.createElement('style');
    var buttonPositionStyle = chatPosition === 'right-bottom' ? 'right: 20px;' : 'left: 20px;';
    style.innerHTML = `
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
            width: 320px; /* Başlangıç genişliği */
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

        /* Ekran genişliği 540px altında olduğunda genişliği %100 yapın ve yanlardan 20px boşluk bırakın */
        @media (max-width: 540px) {
            #chatbotContainer {
                width: calc(100% - 40px); /* Ekran genişliğinden 40px çıkararak hesapla */
                left: 20px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);
  
    // Chatbot butonunu ve penceresini oluşturun
    var chatbotButton = document.createElement('div');
    chatbotButton.id = 'chatbotButton';
    document.body.appendChild(chatbotButton);
  
    var chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbotContainer';
    document.body.appendChild(chatbotContainer);
  
    // Iframe'i chatbot penceresine ekleyin
    var chatbotIframe = document.createElement('iframe');
    chatbotIframe.id = 'chatbotIframe';
    var srcIframe = window.chatbotIframeSrc;
    chatbotIframe.src = srcIframe;
    chatbotContainer.appendChild(chatbotIframe);
  
    // Butona tıklama olayını dinleyin
    chatbotButton.addEventListener('click', function() {
        var display = chatbotContainer.style.display;
        chatbotContainer.style.display = display === 'block' ? 'none' : 'block';
    });
})();
