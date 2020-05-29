const input: HTMLElement = document.querySelector('input') // get the input element
const shell: HTMLElement = document.querySelector('.shell')
const terminalResponse: HTMLElement = document.querySelector('.terminal-response')
const terminalScrolling: HTMLElement = document.querySelector('.terminal--display')
const contentPage: HTMLElement = document.querySelector('.content-page')
let countAction: number = 0 // if < 1 -> don't add br at first line 
const url: string = '/guestbook'

// list of command
const commands = {
    help: {
        name: 'help',
        content: 'Supported commands: <span class="terminal-echo">help</span>, <span class="terminal-echo">about</span>, <span class="terminal-echo">skills</span>, <span class="terminal-echo">projects</span>, <span class="terminal-echo">contact</span>, <span class="terminal-echo">read</span>, <span class="terminal-echo">write</span>, <span class="terminal-echo">clear</span>.'
    },
    about: {
        name: 'about',
        content: 'Hi, I\'m Arnaud Guillard.'
    },
    skills: {
        name: 'skills',
        content: 'You can see all my skills <a class="echo-arg" href="/skills">here</a>, but in one line: </br> PHP, JavaScript, HTML/CSS, C, Symfony and others...'
    },
    project: {
        name: 'projects',
        content: 'You can see all my project <a class="echo-arg" href="/skills">here</a>!'
    },
    contact: {
        name: 'contact',
        content: 'You can join me at this email: <span class="terminal-email">arnaudguillardcontactpro@gmail.com</span> !'
    },
    destroy: {
        name: 'sudo rm -rf /',
        content: 'wait... WAIT NOOOOOOO !!!'
    },
    clear: {
        name: 'clear',
        content: ''
    },
    read: {
        name: 'read',
        content: ''
    },
    write: {
        name: 'write',
        content: 'You can write in my secret guestbook, at the following commands, write your message with this format: <br> Username <span class="terminal-echo">:</span> Hey, your website is awesome !'
    }
}

//! SHELL event

// shell event focus
const handleInputFocus = (e) => {
    input.focus()
}

// shell destroy 
const destroy = () => {
    shell.classList.add('destroy')

    // create error message
    const p: HTMLElement = document.createElement('p')
    p.innerHTML = 'You have broken the shell :/'
    p.classList.add('broken')

    setTimeout(() => {
        contentPage
            .appendChild(p)
            .parentNode
            .removeChild(shell)
    }, 1500)
}

// get content of guestbook.json
const guestbookContent = () => {

    // commands.read.content = ""
    fetch('../assets/files/guestbook.json')
        .then((data) => {
            return data.json()
        })
        .then((obj) => {
            commands.read.content = ""
            for (const key in obj) {
                const element = obj[key]
                commands.read.content += `${element.username} : ${element.content} ${(obj[key + 1] === "undefined" ? 's' : '</br>')}`
            }
            commands.read.content = commands.read.content.replace(new RegExp('</br>' + '$'), ''); // remove last </br>
        })
        .catch((err) => {
            console.error("Error, press F5 to refresh.")
        })
}

// write in shell 
const write = (message: Array<string>): boolean => {

    let result: boolean = true
    const data = {
        username: '',
        content: ''
    }

    data.username = (message.length > 1 ? message[0] : 'Anonymous')
    data.content = (message.length > 1 ? message[1] : message[0])

    fetch(url, {
        method: 'post',
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           },
        body: JSON.stringify(data)
    })
    .then((response) => {
        guestbookContent()
        return response.json()
    })
    .catch((err) => {
        return err
        result = false
    })
    return result
}

//! INPUT event
// when user press enter in the shell
let lastCommand: string;
const handleShellCommand = (e) => {
    let value: string = e.currentTarget.value.trim()

    if (e.keyCode !== 13 || value === '')
        return false

    let response: string = `No such command : ${value} `;
    let isFind: boolean = false
    
    // find match
    for (const property in commands) {
        let element = commands[property]

        if (element.name === value) {
            response = element.content
            isFind = true // use to know if i can apply terminal-echo class in the command
        }
    }
    // clear input 
    e.currentTarget.value = ""
    
    if (lastCommand === 'write') {
        let message: string | any = value.split(/:(.+)?/, 2)
         // split only one once
        if(!write(message))
            response = 'writing format is not supported, please retry.'
        else
            response = 'Your message has been send !'
    }
    // set new value for last command
    lastCommand = value;

    // if command is clear, i clear the terminal
    if (value === commands.clear.name) {
        terminalResponse.innerHTML = ""
        countAction = 0
        return
    }

    if (value === commands.destroy.name) {
        destroy()
        return
    }

    // the first line doesn't start with <br> 
    terminalResponse.innerHTML += (countAction > 0 ? `</br>` : ' ') + `<span class="terminal-arrow">&#8702 </span> <span class="terminal-home">~ </span> <span class="${(isFind ? 'terminal-echo' : '')}">${value}</span> </br> ${response}`
    countAction++

    // scroll to the bottom
    terminalScrolling.scrollTop = terminalScrolling.scrollHeight
}

// when user is typing
const handleUserIsTyping = (e) => {
    let field = e.currentTarget // input
    let str: string = field.value // input value
    let values: string | any = str.split(" ") // array of world 

    // find match
    let isMatch: boolean = false
    for (const property in commands) {
        let element = commands[property]

        if (element.name === values[0])
            isMatch = true
    }
    // no match and more one world
    if (!isMatch || values.length > 1) {
        field.classList.remove('terminal-echo')
        return
    }
    field.classList.add('terminal-echo')
}

// remove multiple space in input
const removeMultipleSpace = (e) => {
    if (e.keyCode !== 32)
        return false

    e.currentTarget.value = e.currentTarget.value.trim() + " "
}

document.addEventListener('DOMContentLoaded', () => {

    shell.addEventListener('click', handleInputFocus)
    input.addEventListener("keyup", handleShellCommand)
    input.addEventListener("keyup", removeMultipleSpace)
    input.addEventListener("input", handleUserIsTyping)
    guestbookContent()
})