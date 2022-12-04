const { Notification } = require('electron');

module.exports = { windowsHideNotification }

function windowsHideNotification(){
    const notification = new Notification({
        title: 'Mouse Clicker',
        subtitle: 'Haz escondido la aplicaccion',
        body: 'Para reactivarla preciona CTRL + L o usa el try icon',
        hasReply: true
    });
    notification.show();
}