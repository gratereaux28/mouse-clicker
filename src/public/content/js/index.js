document.addEventListener("DOMContentLoaded", async function () {
    const theme = window.localStorage.getItem('theme');
    if (!theme || theme === 'undefined')
        await window.darkMode.system();
    else
        await window.darkMode.set(theme);

    window.api.receive('toggleDarkMode', (theme) => {
        window.localStorage.setItem('theme', theme);
    });
    
    window.api.receive('initActiveProcess', async () => {
        await initActiveProcess();
    });
    
    window.api.receive('stopActiveProcess', async () => {
        await stopActiveProcess();
    });

    await initActiveProcess();
});

async function initActiveProcess(){    
    const activeProcess = window.localStorage.getItem('activeProcess');
    if (activeProcess === 'clicker') {
        const clicker = JSON.parse(window.localStorage.getItem('clicker-interval'));
        const hours = clicker.hours;
        let minutes = clicker.minutes;
        let seconds = clicker.seconds;
        let miliseconds = 0;

        const action = clicker.action;
        const mouse = clicker.mouse;

        if (hours && hours > 0)
            minutes = minutes + (hours * 60)
        if (minutes && minutes > 0)
            miliseconds = miliseconds + (minutes * 60000)
        if (seconds && seconds > 0)
            miliseconds = seconds * 1000

        console.log("start");
        setInterval(async function () {
            await window.mouse.click({ action, mouse });
        }, miliseconds)
    }
    else if (activeProcess === 'mover') {
        const mover = JSON.parse(window.localStorage.getItem('mover-interval'));
        const hours = mover.hours;
        let minutes = mover.minutes;
        let seconds = mover.seconds;
        let miliseconds = 0;
        
        const x = mover.x;
        const y = mover.y;
        const time = mover.time;
    
        if(hours && hours > 0)
            minutes = minutes + (hours * 60)
        if(minutes && minutes > 0)
            miliseconds = miliseconds + (minutes * 60000)
        if(seconds && seconds > 0)
            miliseconds = seconds * 1000
        
        console.log("start");
        setInterval(async function(){
            await window.mouse.move({x, y, time});
          }, miliseconds)
    }
}

async function stopActiveProcess(){
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }

    if(document.getElementById('mover-btnStart'))
        document.getElementById('mover-btnStart').removeAttribute('disabled');

    if(document.getElementById('clicker-btnStart'))
            document.getElementById('clicker-btnStart').removeAttribute('disabled');
}