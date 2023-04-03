var socket = io();

var pseudo = "uu";
var chat_select = 'general';
socket.emit('set-pseudo', pseudo);
console.log("ok");

var messages = document.getElementById('messages');
var form = document.getElementById("form");
var input = document.getElementById('message');
var id_salon = "salon";
var lesMessages = [];
var log_form = document.getElementById("log_form");

log_form.addEventListener('submit', (e) => {
  e.preventDefault()
  user_password = e.target.password.value,
  user_login = e.target.login.value

  socket.emit('recup_log', user_login,user_password);
});

form.addEventListener('form', (e) => {
  e.preventDefault();
  let Message = {
    emeteur : pseudo, 
    recepteur : chat_select,
    content : input.value
  } 
  socket.emit('emission_message', Message);
})

socket.on('reception_message', (Message) => {
  messages.innerHTML = "";
  lesMessages.push(Message)
  lesMessages.forEach(element => {
    if(element.emeteur === pseudo && element.recepteur === chat_select){
      var text = document.createElement('li');
      text.classList.add("envoye")
      text.innerHTML = element.content
      messages.appendChild(text);
      console.log("message envoyé")
    }else if(element.emeteur === chat_select && element.recepteur === pseudo){
      var text = document.createElement('li');
      text.classList.add("recu")
      text.innerHTML = element.content
      messages.appendChild(text);
      console.log("message reçu")
    }else if(element.recepteur === chat_select && chat_select === 'general'){
      var text = document.createElement('li');
      text.classList.add("general")
      text.innerHTML = element.content
      messages.appendChild(text);
      console.log("message general")
    }//condition éméteur et recepteur 2 cond
  });
  console.log("Message stockés" +lesMessages)

  
});

function salon(id) {
  chat_select = id
  socket.emit("sync", lesMessages)

}

socket.on('reception_user', (users) => {
  console.log(users)
  var users_list = document.getElementById('users_list');
  users_list.innerHTML = `<li><button id='general' onclick="salon('general')">Géneral</button></li`;
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


