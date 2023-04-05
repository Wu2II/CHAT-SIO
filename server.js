const express = require('express');
const app = express();
const session = require('express-session')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require("path");
let PORT = 8082;
let infosUtilisateur;

const mariadb = require('mariadb');
const { query } = require('express');
const { copyFileSync } = require('fs');
const db = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sio_chat'
});



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(PORT, () => {
    console.log('serveur ' + PORT);
});



app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/salon', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'js/client.js'));
});

app.get('/style', (req, res) => {
    res.sendFile(path.join(__dirname, 'css/style.css'));
});




var utilisateur = {};
var pseudo = ""

io.on('connection', (socket) => {

    socket.on('set-pseudo', () => {
        console.log(pseudo + "vient de se connecter a " + new Date());
        socket.nickname = pseudo;
        console.log(pseudo);
        utilisateur[socket.id] = {
            id_client: socket.id,
            pseudo_client: pseudo
        };
        socket.emit('set-pseudo', pseudo)
        io.emit('reception_user', Object.values(utilisateur));
    })
    socket.on('emission_message', (Message) => {
        socket.broadcast.emit('reception_message', Message);
        socket.emit('reception_message', Message);
        console.log(Message);

    });
    socket.on('sync', syncMessage => {
        socket.emit('reception_message', syncMessage)
    })

    socket.on('disconnect', () => {
        console.log('utilisateur deconnecté' + socket.id);
        delete utilisateur[socket.id];
        io.emit('reception_user', Object.values(utilisateur));
    })


    async function asyncFunction(user_login, user_password) {
        let conn
        try {
            conn = await db.getConnection();
            const rows = await conn.query("SELECT * from utilisateurs WHERE pseudo = ? AND mdp = ?", [user_login, user_password]);
            if(rows.length > 0){
                pseudo = user_login
                return true
            }else{
                return false
            }
        } catch (err) {
            console.log("erreur : " + err);
            return false
        } finally {
            if (conn) conn.release
        }
    }

    socket.on('recup_log', async (user_login, user_password) => {
        console.log(user_login, user_password);
        test =  {
            verif: await asyncFunction(user_login, user_password),
            login: user_login
        }
        socket.emit("recup_log", (test));
        
    });


})


