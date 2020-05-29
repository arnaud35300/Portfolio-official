var lastCommand,input=document.querySelector("input"),shell=document.querySelector(".shell"),terminalResponse=document.querySelector(".terminal-response"),terminalScrolling=document.querySelector(".terminal--display"),contentPage=document.querySelector(".content-page"),countAction=0,url="/guestbook",commands={help:{name:"help",content:'Supported commands: <span class="terminal-echo">help</span>, <span class="terminal-echo">about</span>, <span class="terminal-echo">skills</span>, <span class="terminal-echo">projects</span>, <span class="terminal-echo">contact</span>, <span class="terminal-echo">read</span>, <span class="terminal-echo">write</span>, <span class="terminal-echo">clear</span>.'},about:{name:"about",content:"Hi, I'm Arnaud Guillard. I'm web developer and like you apparently, i don't like graphical interfaces."},skills:{name:"skills",content:'You can see all my skills <a class="echo-arg" href="/skills">here</a>, but in one line: </br> PHP, JavaScript, HTML/CSS, C, Symfony and others...'},project:{name:"projects",content:'You can see all my project <a class="echo-arg" href="/projects">here</a>!'},contact:{name:"contact",content:'You can join me at this email: <span class="terminal-email">arnaudguillardcontactpro@gmail.com</span>. You can also come <a class="echo-arg" href="/contact">here</a> to contact me'},destroy:{name:"sudo rm -rf /",content:"wait... WAIT NOOOOOOO !!!"},clear:{name:"clear",content:""},read:{name:"read",content:""},write:{name:"write",content:'You can write in my secret guestbook, at the following commands, write your message with this format: <br> Username <span class="terminal-echo">:</span> Hey, your website is awesome !'}},handleInputFocus=function(e){input.focus()},destroy=function(){shell.classList.add("destroy");var e=document.createElement("p");e.innerHTML="You have broken the shell :/",e.classList.add("broken"),setTimeout((function(){contentPage.appendChild(e).parentNode.removeChild(shell)}),1500)},guestbookContent=function(){fetch("../assets/files/guestbook.json").then((function(e){return e.json()})).then((function(e){for(var n in commands.read.content="",e){var t=e[n];commands.read.content+=t.username+" : "+t.content+" "+("undefined"===e[n+1]?"s":"</br>")}commands.read.content=commands.read.content.replace(new RegExp("</br>$"),"")})).catch((function(e){console.error("Error, press F5 to refresh.")}))},write=function(e){var n=!0,t={username:"",content:""};return t.username=e.length>1?e[0]:"Anonymous",t.content=e.length>1?e[1]:e[0],fetch(url,{method:"post",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t)}).then((function(e){return guestbookContent(),e.json()})).catch((function(e){return e})),n},handleShellCommand=function(e){var n=e.currentTarget.value.trim();if(13!==e.keyCode||""===n)return!1;var t="No such command : "+n+" ",a=!1;for(var o in commands){var r=commands[o];r.name===n&&(t=r.content,a=!0)}if(e.currentTarget.value="","write"===lastCommand){var s=n.split(/:(.+)?/,2);t=write(s)?"Your message has been send !":"writing format is not supported, please retry."}if(lastCommand=n,n===commands.clear.name)return terminalResponse.innerHTML="",void(countAction=0);n!==commands.destroy.name?(terminalResponse.innerHTML+=(countAction>0?"</br>":" ")+'<span class="terminal-arrow">&#8702 </span> <span class="terminal-home">~ </span> <span class="'+(a?"terminal-echo":"")+'">'+n+"</span> </br> "+t,countAction++,terminalScrolling.scrollTop=terminalScrolling.scrollHeight):destroy()},handleUserIsTyping=function(e){var n=e.currentTarget,t=n.value.split(" "),a=!1;for(var o in commands){commands[o].name===t[0]&&(a=!0)}!a||t.length>1?n.classList.remove("terminal-echo"):n.classList.add("terminal-echo")},removeMultipleSpace=function(e){if(32!==e.keyCode)return!1;e.currentTarget.value=e.currentTarget.value.trim()+" "};document.addEventListener("DOMContentLoaded",(function(){shell.addEventListener("click",handleInputFocus),input.addEventListener("keyup",handleShellCommand),input.addEventListener("keyup",removeMultipleSpace),input.addEventListener("input",handleUserIsTyping),guestbookContent()}));