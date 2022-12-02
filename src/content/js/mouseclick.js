document.addEventListener("DOMContentLoaded", async function() {
    const theme = window.localStorage.getItem('theme');
    if(!theme)
        await window.darkMode.system();
    else
        await window.darkMode.set(theme);
    
    window.api.receive('startMouseClicker', () => {
        startMouseClicker();
    });
    window.api.receive('stopMouseClicker', () => {
        stopMouseClicker();
    });

    document.getElementById("clicker-key-start").addEventListener("change", async function(){
        const start = document.getElementById("clicker-key-start").value;
        const stop = document.getElementById("clicker-key-stop").value;
        await window.shortcut.clickRegister({start, stop});
    });
    
    const start = document.getElementById("clicker-key-start").value;
    const stop = document.getElementById("clicker-key-stop").value;
    await window.shortcut.clickRegister({start, stop});
});

async function startMouseClicker(){
    const isActive = (window.localStorage.getItem('isActive') == 'true');
    if(isActive)
        return;

    window.localStorage.setItem('isActive', 'true');
    const hours = parseInt(document.getElementById("clicker-interval-hour").value);
    let minutes = parseInt(document.getElementById("clicker-interval-minute").value);
    let seconds = parseInt(document.getElementById("clicker-interval-second").value);
    let miliseconds = 0;

    const action = (document.getElementById("clicker-action-action").value === 'true');
    const mouse = document.getElementById("clicker-action-mouse").value;

    if(hours && hours > 0)
        minutes = minutes + (hours * 60)
    if(minutes && minutes > 0)
        miliseconds = miliseconds + (minutes * 60000)
    if(seconds && seconds > 0)
        miliseconds = seconds * 1000
    
    console.log("start");
    window.app.minimize();
    setInterval(async function(){
        await window.mouse.click({action, mouse});
      }, miliseconds)
      
    document.getElementById('clicker-btnStart').setAttribute('disabled', '');
}

async function stopMouseClicker(){
    console.log("stop");
    window.localStorage.removeItem('isActive');
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    document.getElementById('clicker-btnStart').removeAttribute('disabled');
}

// document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
//     await window.darkMode.toggle()
//   })
  
//   document.getElementById('reset-to-system').addEventListener('click', async () => {
//     await window.darkMode.system()
//   })