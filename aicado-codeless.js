var currentUrl = new URL(window.location.href);
var searchParams = currentUrl.searchParams;

var sParam = searchParams.get('s');
var tParam = searchParams.get('t');

function checkHeightChange() {
    var el = document.getElementById('aicadoContainerPrimary');

    if (el) {
        var currentHeight = el.scrollHeight;
        window.parent.postMessage({
            iframeSrc: window.location.href,
            sParameter: sParam,
            tParameter: tParam,
            action: 'aicadoResize',
            frameHeight: currentHeight
        }, '*');
    }

}


var intervalId = setInterval(checkHeightChange, 500);


setTimeout(function () {
    clearInterval(intervalId);
}, 5000);


function pushHeight() {



    var observedElement = document.getElementById('aicadoContainerPrimary');
    if (observedElement) {
        var resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const newHeight = entry.target.scrollHeight;
                window.parent.postMessage({
                    iframeSrc: window.location.href,
                    sParameter: sParam,
                    tParameter: tParam,
                    action: 'aicadoResize',
                    frameHeight: newHeight
                }, '*');
            }
        });
        resizeObserver.observe(observedElement);
    }




    var aicadoButtonPrimary = document.getElementById('aicadoButtonPrimary');
    var outputElement = document.getElementById('aicadoOutput');
    if (aicadoButtonPrimary) {

        window.parent.postMessage({
            height: outputElement.offsetHeight
        }, '*');


        aicadoButtonPrimary.addEventListener('click', function () {

            window.parent.postMessage({
                elHeight: outputElement.offsetHeight
            }, '*');

            if (outputElement) {
                var rect = outputElement.getBoundingClientRect();
                var topPosition = rect.top + window.pageYOffset;


                window.parent.postMessage({
                    iframeSrc: window.location.href,
                    sParameter: sParam,
                    tParameter: tParam,
                    action: 'scrollToOutput',
                    top: topPosition
                }, '*');
            }
        });

    }
}

setTimeout(pushHeight, 5000);
