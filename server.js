const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require("path");
let PORT = 8082;

server.listen(PORT, () => {
    console.log('serveur ' + PORT);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'js/client.js'));
});

app.get('/style', (req, res) => {
    res.sendFile(path.join(__dirname, 'css/style.css'));
});

var utilisateur = {};

io.on('connection', (socket) => {

    socket.on('set-pseudo', (pseudo) => {
        console.log(pseudo + "vient de se connecter a " + new Date());
        socket.nickname = pseudo;
        console.log(pseudo);
        utilisateur[socket.id] = {
            id_client: socket.id,
            pseudo_client: pseudo
        };
        io.emit('reception_user', Object.values(utilisateur));
    })
    socket.on('emission_message', (Message) => {
        socket.broadcast.emit('reception_message', Message);
        socket.emit('reception_message', Message);
        console.log(Message);
      
    });

    socket.on('disconnect', () =>{
        console.log('utilisateur deconnecté' +socket.id);
        delete utilisateur[socket.id];
        io.emit('reception_user', Object.values(utilisateur));
    })

    
})


