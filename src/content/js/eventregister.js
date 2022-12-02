document.addEventListener("DOMContentLoaded", async function () {
    const theme = window.localStorage.getItem('theme');
    if (!theme)
        await window.darkMode.system();
    else
        await window.darkMode.set(theme);
        
    window.addEventListener('keypress', function (e) {
        console.log("You pressed " + doWhichKey(e));
    }, false);
});

function doWhichKey(e) {
    e = e || window.event;
    let charCode = e.keyCode || e.which;
    return String.fromCharCode(charCode);
} 