var socket = io();

socket.emit('set-pseudo', prompt("Pseudo ?"));

var messages = document.getElementById('messages');
var form = document.getElementById("form");
var input = document.getElementById('message');
var button = document.getElementById("disco")


form.addEventListener('submit', (e) =>{
    e.preventDefault();
    socket.emit('emission_message', input.value);
    //input.value="";
  let valueMes= input.value
   console.log(valueMes);  
})

socket.on('reception_message', (contenu)=>{
var message = document.createElement('li');
message.innerHTML = contenu;
messages.appendChild(message);

});
