document.addEventListener("DOMContentLoaded", async function() {
    const theme = window.localStorage.getItem('theme');
    if(!theme)
        await window.darkMode.system();
    else
        await window.darkMode.set(theme);
    
    window.api.receive('startMouseMover', () => {
        startMouseMover();
    });
    window.api.receive('stopMouseMover', () => {
        stopMouseMover();
    });

    document.getElementById("mover-key-start").addEventListener("change", async function(){
        const start = document.getElementById("mover-key-start").value;
        const stop = document.getElementById("mover-key-stop").value;
        await window.shortcut.moveRegister({start, stop});
    });
    
    const start = document.getElementById("mover-key-start").value;
    const stop = document.getElementById("mover-key-stop").value;
    await window.shortcut.moveRegister({start, stop});
});

async function startMouseMover(){
    const isActive = (window.localStorage.getItem('isActive') == 'true');
    if(isActive)
        return;

    window.localStorage.setItem('isActive', 'true');
    const hours = parseInt(document.getElementById("mover-interval-hour").value);
    let minutes = parseInt(document.getElementById("mover-interval-minute").value);
    let seconds = parseInt(document.getElementById("mover-interval-second").value);
    let miliseconds = 0;

    if(hours && hours > 0)
        minutes = minutes + (hours * 60)
    if(minutes && minutes > 0)
        miliseconds = miliseconds + (minutes * 60000)
    if(seconds && seconds > 0)
        miliseconds = seconds * 1000
    
    console.log("start");
    await window.app.minimize();
    setInterval(async function(){
        await window.mouse.move();
      }, miliseconds)
      
    document.getElementById('mover-btnStart').setAttribute('disabled', '');
}

async function stopMouseMover(){
    console.log("stop");
    window.localStorage.removeItem('isActive');
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    document.getElementById('mover-btnStart').removeAttribute('disabled');
}

// document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
//     await window.darkMode.toggle()
//   })
  
//   document.getElementById('reset-to-system').addEventListener('click', async () => {
//     await window.darkMode.system()
//   })