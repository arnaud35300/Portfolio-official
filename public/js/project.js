document.addEventListener('DOMContentLoaded', () => {
    // let element = document.querySelector('.project__title')
    // element.click()
    target = document.querySelector(".project__title")
    var e = new Event('touchstart');
    target.dispatchEvent(e);
})