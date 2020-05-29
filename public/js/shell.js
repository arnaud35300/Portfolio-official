var input = document.querySelector('input'); // get the input element
var shell = document.querySelector('.shell');
var terminalResponse = document.querySelector('.terminal-response');
var terminalScrolling = document.querySelector('.terminal--display');
var contentPage = document.querySelector('.content-page');
var countAction = 0; // if < 1 -> don't add br at first line 
var url = '/guestbook';
// list of command
var commands = {
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
        content: 'You can see all my project <a class="echo-arg" href="/projects">here</a>!'
    },
    contact: {
        name: 'contact',
        content: 'You can join me at this email: <span class="terminal-email">arnaudguillardcontactpro@gmail.com</span>. You can also come <a class="echo-arg" href="/contact">here</a> to contact me'
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
};
//! SHELL event
// shell event focus
var handleInputFocus = function (e) {
    input.focus();
};
// shell destroy 
var destroy = function () {
    shell.classList.add('destroy');
    // create error message
    var p = document.createElement('p');
    p.innerHTML = 'You have broken the shell :/';
    p.classList.add('broken');
    setTimeout(function () {
        contentPage
            .appendChild(p)
            .parentNode
            .removeChild(shell);
    }, 1500);
};
// get content of guestbook.json
var guestbookContent = function () {
    // commands.read.content = ""
    fetch('../assets/files/guestbook.json')
        .then(function (data) {
            return data.json();
        })
        .then(function (obj) {
            commands.read.content = "";
            for (var key in obj) {
                var element = obj[key];
                commands.read.content += element.username + " : " + element.content + " " + (obj[key + 1] === "undefined" ? 's' : '</br>');
            }
            console.log('e')
            commands.read.content = commands.read.content.replace(new RegExp('</br>' + '$'), ''); // remove last </br>
        })["catch"](function (err) {
            console.error("Error, press F5 to refresh.");
        });
};
// write in shell 
var write = function (message) {
    var result = true;
    var data = {
        username: '',
        content: ''
    };
    data.username = (message.length > 1 ? message[0] : 'Anonymous');
    data.content = (message.length > 1 ? message[1] : message[0]);
    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            guestbookContent();
            return response.json();
        })["catch"](function (err) {
            return err;
            result = false;
        });
    return result;
};
//! INPUT event
// when user press enter in the shell
var lastCommand;
var handleShellCommand = function (e) {
    
    var value = e.currentTarget.value.trim();
    if (e.keyCode !== 13 || value === '')
        return false;
    var response = "No such command : " + value + " ";
    var isFind = false;
    // find match
    for (var property in commands) {
        var element = commands[property];
        if (element.name === value) {
            response = element.content;
            isFind = true; // use to know if i can apply terminal-echo class in the command
        }
    }
    // clear input 
    e.currentTarget.value = "";
    if (lastCommand === 'write') {
        var message = value.split(/:(.+)?/, 2);
        // split only one once
        if (!write(message))
            response = 'writing format is not supported, please retry.';
        else
            response = 'Your message has been send !';
    }
    // set new value for last command
    lastCommand = value;
    // if command is clear, i clear the terminal
    if (value === commands.clear.name) {
        terminalResponse.innerHTML = "";
        countAction = 0;
        return;
    }
    if (value === commands.destroy.name) {
        destroy();
        return;
    }
    // the first line doesn't start with <br> 
    terminalResponse.innerHTML += (countAction > 0 ? "</br>" : ' ') + ("<span class=\"terminal-arrow\">&#8702 </span> <span class=\"terminal-home\">~ </span> <span class=\"" + (isFind ? 'terminal-echo' : '') + "\">" + value + "</span> </br> " + response);
    countAction++;
    // scroll to the bottom
    terminalScrolling.scrollTop = terminalScrolling.scrollHeight;
};
// when user is typing
var handleUserIsTyping = function (e) {
    var field = e.currentTarget; // input
    var str = field.value; // input value
    var values = str.split(" "); // array of world 
    // find match
    var isMatch = false;
    for (var property in commands) {
        var element = commands[property];
        if (element.name === values[0])
            isMatch = true;
    }
    // no match and more one world
    if (!isMatch || values.length > 1) {
        field.classList.remove('terminal-echo');
        return;
    }
    field.classList.add('terminal-echo');
};
// remove multiple space in input
var removeMultipleSpace = function (e) {
    if (e.keyCode !== 32)
        return false;
    e.currentTarget.value = e.currentTarget.value.trim() + " ";
};
document.addEventListener('DOMContentLoaded', function () {
    shell.addEventListener('click', handleInputFocus);
    input.addEventListener("keyup", handleShellCommand);
    input.addEventListener("keyup", removeMultipleSpace);
    input.addEventListener("input", handleUserIsTyping);
    guestbookContent();
});
