export const reloadSetTime = (time) => {
    time = time * 1000;
    setTimeout(() => {
        window.location.reload()
    }, time);
}