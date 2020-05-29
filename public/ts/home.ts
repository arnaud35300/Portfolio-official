// keyboards typing simulate
const title: HTMLElement = document.getElementById('text')
const text: Array<string> = ['web developer', 'linux addict', 'beginning C programmer', 'open source supporter', 'specialized in Symfony framework', 'raccoon']

let timer = setInterval(() => {
    typingEffect(text, title);
}, 500)

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min+1) + min);
}

async function typingEffect(textArray: Array<string>, htmlElement: HTMLElement, str_i: number = 0, arr_i: number = 0) {

    htmlElement.innerHTML = textArray[arr_i].slice(0, str_i);
    str_i++

    if (str_i > textArray[arr_i].length) {
        str_i = 0
        arr_i++

        await new Promise(r => setTimeout(r, 1000)); // delay (sleep)
        
        if (arr_i >= textArray.length) {
            arr_i = 0
        }
    }
    clearInterval(timer) // stop
    timer = setInterval(() => {
        typingEffect(textArray, htmlElement, str_i, arr_i);
    }, randomNumber(100, 300));
}