import 'dotenv/config'
import "reflect-metadata"
import express, {Express} from 'express';
import * as http from "http";
import * as socket from "socket.io";
import cors from "cors";
import {routesRouter} from "./routes/routes";
import {initDatabase} from "./database/database";
import path from 'node:path';

const origins = [
    "https://main.d3i9env3ux4lc9.amplifyapp.com",
    /^http:\/\/localhost:./,
    "http://localhost:3000"
]

const app: Express = express();
const server = http.createServer(app);

const io = new socket.Server(server, {
    cors: {
        origin: origins,
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: origins,
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../src/public')));

app.use(routesRouter);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });
  
    socket.on("send_msg", (data) => {
      console.log(data, "DATA");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("receive_msg", data);
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });


    // justin's code above

    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name
        })
    })

    socket.on("answerCall", data => io.to(data.to).emit("callAccepted", {
        signal: data.signal
    }))
});

initDatabase()
    .then(() => {
        console.log(`Connected to database. Starting web server at ${new Date().toString()}...`)
        const serverPort = process.env.PORT || 3000
        server.listen(serverPort, () => {
            console.log(`Server running on port ${serverPort} (http://localhost:${serverPort})`);
        });
    })
    .catch((error) => {
        console.error("Unable to connect to database. Stopping web server.", error)
    })