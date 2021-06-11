var mongoose = require('mongoose');

const app = require('express')()
var bodyparser = require('body-parser');

const serverHttp = require('http').Server(app)
const io = require('socket.io')(serverHttp, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST"]
    }
})

var users_routes = require('./routes/user');
var message_routes = require('./routes/message');

const myMessages = []

io.on('connection', (socket) => {
    console.log('New user connected')
    /*
    socket.on('send-message', function (data) {
        //myMessages.push(data)
        //socket.emit('text-event', myMessages)
        socket.broadcast.emit('text-event', data)
    })*/
    //SEND MESSAGES
    socket.on('save-message', function (new_msm) {
        io.emit('new-message', { message: new_msm });
    });

    //CONFIG
    socket.on('save-user', function (user) {
        io.emit('get-user', { user: user });
    });

    //CONFIG
    socket.on('save-users', function (users) {
        io.emit('get-users', {users});
    });

    socket.on('save-identity', function (user) {
        io.emit('get-identity', {user});
    });
})
mongoose.connect('mongodb://localhost:27017/messenger', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Corriendo....");

        serverHttp.listen(3000, function () {
            console.log("Servidor " + 3000);
        });
    }
});

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.header('Content-Type: application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});
app.use('/api', users_routes);
app.use('/api', message_routes);


module.exports = app;
