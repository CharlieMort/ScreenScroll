console.log("hiyua")
let clientIndex= 9999;
let maxWidth = 0;
let globalX = 0;
let clientsArr = []
let preX = 0;

function setup() {
    createCanvas(innerWidth, innerHeight)
    socket = io()
    frameRate(60)
    
    socket.on("maxWidth", (data) => {
        maxWidth = data;
    })

    socket.on("clientIndex", (data) => {
        clientIndex = data
        socket.emit("widthSet", {
            idx: data,
            width: innerWidth
        });
    })
    socket.on("clients", (clients) => {
        clientsArr = [...clients];
        clientsArr.map((client, idx) => {
            if (client.id === socket.id) {
                clientIndex = idx;
                console.log(idx);
            }
        })
    })
    socket.on("posX", (data) => {
        globalX = data;
        preX = 0;
        for (let i = 0; i<clientIndex; i++) {
            if (clientsArr.length > 0) {
                preX += clientsArr[i].width
            }
        }
    })
}

function draw() {
    background(255);
    textSize(100)
    text(clientIndex, 100, 100);
    if (clientIndex === 0) {
        if (globalX > width) {
            text("The Sixth Form College Colchester", globalX-maxWidth, height/2);
        }
        else {
            text("The Sixth Form College Colchester", globalX, height/2);
        }
    }
    else {
        text("The Sixth Form College Colchester", globalX-preX, height/2);
    }
}