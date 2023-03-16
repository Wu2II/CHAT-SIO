var socket = io();

var pseudo = prompt("Pseudo ?")
var chat_select = 'general';
socket.emit('set-pseudo', pseudo);

var messages = document.getElementById('messages');
var form = document.getElementById("form");
var input = document.getElementById('message');
var id_salon = "salon";
var lesMessages = [];


form.addEventListener('submit', (e) => {
  e.preventDefault();
  let Message = {
    emeteur : pseudo, 
    recepteur : chat_select,
    content : input.value
  } 
  socket.emit('emission_message', Message);
  //input.value="";
  
})

socket.on('reception_message', (Message) => {
  var message = document.createElement('li');
  message.innerHTML = Message.content;
  messages.appendChild(message);
  lesMessages = [];
  lesMessages.push(Message)
  console.log("Message stockés" +lesMessages)

  lesMessages.forEach(element => {
    
  });

});

function salon(id) {
  chat_select = id
  messages.innerHTML = ''

}

socket.on('reception_user', (users) => {
  console.log(users)
  var users_list = document.getElementById('users_list');
  users_list.innerHTML = "<li><button id='general' onclick='salon('general')'>Géneral</button></li";
  let user_item = users.map((user) => {
    if (user.pseudo_client !== pseudo){
      var list_item = document.createElement('li');
      list_item.classList.add('user')
      list_item.innerHTML = `<button id="button_user" onclick="salon('${user.pseudo_client}')">${user.pseudo_client}</button>`
      return list_item
    }else{
      return null
    }
    
  })
  user_item.forEach(element => {
    if (element !== null ){
      users_list.appendChild(element)
    }
    
  });
})