document.addEventListener("DOMContentLoaded", async function () {
    const theme = window.localStorage.getItem('theme');
    if (!theme || theme === 'undefined')
        await window.darkMode.system();
    else
        await window.darkMode.set(theme);

    window.api.receive('toggleDarkMode', (theme) => {
        window.localStorage.setItem('theme', theme);
    });
});