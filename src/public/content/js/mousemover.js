document.addEventListener("DOMContentLoaded", async function() {    
    window.api.receive('startMouseMover', () => {
        startMouseMover();
        document.getElementById('mover-btnStart').setAttribute('disabled', '');
    });
    window.api.receive('stopMouseMover', () => {
        stopMouseMover();
        document.getElementById('mover-btnStart').removeAttribute('disabled');
    });

    document.getElementById("mover-key-start").addEventListener("change", async function(){
        const start = document.getElementById("mover-key-start").value;
        const stop = document.getElementById("mover-key-stop").value;
        await window.shortcut.moveRegister({start, stop});
    });
    
    const start = document.getElementById("mover-key-start").value;
    const stop = document.getElementById("mover-key-stop").value;
    await window.shortcut.moveRegister({start, stop});

    applyIntervalChanges();
    
    const activeProcess = window.localStorage.getItem('activeProcess');
    if(activeProcess)
        document.getElementById('mover-btnStart').setAttribute('disabled', '');
});

async function startMouseMover(){
    const activeProcess = window.localStorage.getItem('activeProcess');
    if(activeProcess)
        return;

    window.localStorage.setItem('activeProcess', 'mover');
    const hours = parseInt(document.getElementById("mover-interval-hour").value);
    let minutes = parseInt(document.getElementById("mover-interval-minute").value);
    let seconds = parseInt(document.getElementById("mover-interval-second").value);
    let miliseconds = 0;
    
    const x = parseInt(document.getElementById("mover-poss-x").value);
    const y = parseInt(document.getElementById("mover-poss-y").value);
    const time = document.getElementById("mover-poss-time").value;

    if(hours && hours > 0)
        minutes = minutes + (hours * 60)
    if(minutes && minutes > 0)
        miliseconds = miliseconds + (minutes * 60000)
    if(seconds && seconds > 0)
        miliseconds = seconds * 1000
    
    console.log("start");
    await window.app.minimize();
    setInterval(async function(){
        await window.mouse.move({x, y, time});
      }, miliseconds)
      
    document.getElementById('mover-btnStart').setAttribute('disabled', '');
}

async function stopMouseMover(){
    console.log("stop");
    window.localStorage.removeItem('activeProcess');
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    document.getElementById('mover-btnStart').removeAttribute('disabled');
}

async function onKeyChanges(){
    const start = document.getElementById("mover-key-start").value;
    const stop = document.getElementById("mover-key-stop").value;
    await window.shortcut.clickRegister({start, stop});
    aveIntervalChanges();
}

async function saveIntervalChanges(){
    const hours = parseInt(document.getElementById("mover-interval-hour").value);
    let minutes = parseInt(document.getElementById("mover-interval-minute").value);
    let seconds = parseInt(document.getElementById("mover-interval-second").value);
    const start = document.getElementById("mover-key-start").value;
    const stop = document.getElementById("mover-key-stop").value;
    const x = parseInt(document.getElementById("mover-poss-x").value);
    const y = parseInt(document.getElementById("mover-poss-y").value);
    const time = document.getElementById("mover-poss-time").value;
    const changes = {
        hours,
        minutes,
        seconds,
        start,
        stop,
        x,
        y,
        time
    };

    window.localStorage.setItem('mover-interval', JSON.stringify(changes));
}

async function applyIntervalChanges(){
    const changes = JSON.parse(window.localStorage.getItem('mover-interval'));
    if(changes){
        document.getElementById("mover-interval-hour").value = changes.hours;
        document.getElementById("mover-interval-minute").value = changes.minutes;
        document.getElementById("mover-interval-second").value = changes.seconds;
        document.getElementById("mover-key-start").value = changes.start;
        document.getElementById("mover-key-stop").value = changes.stop;
        document.getElementById("mover-poss-x").value = changes.x;
        document.getElementById("mover-poss-y").value = changes.y;
        document.getElementById("mover-poss-time").value = changes.time;
    }
}