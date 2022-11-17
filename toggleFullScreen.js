const icons = document.querySelectorAll('.map-toggle-full-screen-btn svg')
function toggleFullScreen(e) {
    icons.forEach(icon => icon.classList.toggle('open'));
    const iframe = document.querySelector('iframe');
    const element = iframe || document;
    if (!element.fullscreenElement &&    // alternative standard method
        !element.mozFullScreenElement && !element.webkitFullscreenElement && !element.msFullscreenElement) {  // current working methods
        if (element.documentElement.requestFullscreen) {
            element.documentElement.requestFullscreen();
        } else if (element.documentElement.msRequestFullscreen) {
            element.documentElement.msRequestFullscreen();
        } else if (element.documentElement.mozRequestFullScreen) {
            element.documentElement.mozRequestFullScreen();
        } else if (element.documentElement.webkitRequestFullscreen) {
            element.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (element.exitFullscreen) {
            element.exitFullscreen();
        } else if (element.msExitFullscreen) {
            element.msExitFullscreen();
        } else if (element.mozCancelFullScreen) {
            element.mozCancelFullScreen();
        } else if (element.webkitExitFullscreen) {
            element.webkitExitFullscreen();
        }
    }
}