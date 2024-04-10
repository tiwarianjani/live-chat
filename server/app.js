const express = require('express');
const http = require('http'); // Import the http module
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());

const server = http.createServer(app); // Use createServer from http module

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send("<h1>I am called as get</h1>")
})

io.on('connection', (socket) => {
    console.log("User connected ");
    console.log("id: ", socket.id);
    socket.emit("welcome", "welcome");

    socket.on('message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log("disconnected: ", socket.id);
    });
});

server.listen(port, () => {
    console.log(` Listen successful !! ${port} `)
})
