const express = require("express")
const cors = require("cors")
const socketIO = require("socket.io")
const http = require("http")

let app = express();

app.use(express.static("public"))

app.use(cors());

let server = http.createServer(app);

let io = socketIO(server)

let clients = [];
let globalX = 0;
let maxWidth = 0;

function SendX() {
    globalX += 10
    if (globalX >= maxWidth) {
        globalX = 0;
        console.log("reset");
    }
    io.emit("posX", globalX)
    return;
}

setInterval(SendX, 33)

io.on("connection", (socket) => {
    console.log(`${socket.id} Has Connected`)
    clients.push({
        id: socket.id,
        width:undefined
    });
    socket.emit("clientIndex", clients.length-1);
    console.log(`${io.engine.clientsCount} Clients Connected`)

    socket.on("widthSet", (data) => {
        clients[data.idx].width = data.width;
        console.log(data.width+"width");
        maxWidth = 0;
        clients.map((client, idx) => {
            maxWidth += client.width;
        })
        console.log(maxWidth)
        io.emit("maxWidth", maxWidth);
        io.emit("clients", clients);
    })

    socket.on("disconnect", () => {
        clients.map((client, idx) => {
            if (client.id == socket.id) {
                clients.splice(idx)
            }
        })
        globalX = 0;
        clients.map((client, idx) => {
            maxWidth += client.width;
        })
        io.emit("maxWidth", maxWidth);
        io.emit("clients", clients);
        io.emit("posX", globalX);
        console.log(clients);
    })
})

server.listen(3000, () => console.log("Server Listening On Port 3000"));