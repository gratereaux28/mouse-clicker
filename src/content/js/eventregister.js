document.addEventListener("DOMContentLoaded", async function () {
    setInterval(() => {
        const keypressed = window.localStorage.getItem('keypressed');
        document.getElementById('event-output').value = keypressed;
    }, 500);
});

async function startKeyPress(){
    window.keyPress.start();
    document.getElementById('key-btnStart').setAttribute('disabled', '');
}

async function stopKeyPress(){
    window.keyPress.stop();
    document.getElementById('key-btnStart').removeAttribute('disabled');
}

async function clearKeyPress(){
    window.localStorage.removeItem('keypressed');
    document.getElementById('event-output').value = '';
}