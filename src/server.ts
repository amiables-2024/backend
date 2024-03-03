import 'dotenv/config'
import "reflect-metadata"
import express, {Express} from 'express';
import * as http from "http";
import * as socket from "socket.io";
import cors from "cors";
import {routesRouter} from "./routes/routes";
import {initDatabase, messageRepository, projectRepository, userRepository} from "./database/database";
import path from 'node:path';
import {initSocketIOServer} from "./socketio/socketio";
import {BroadcastMessageData, JoinRoomData, UserSendMessageData} from "./types/socketio.types";
import {Message} from "./models/message/message.model";

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

    socket.on("join_room", ({projectId}: JoinRoomData) => {
        socket.join(projectId);
    });

    socket.on("send_msg", async (data: UserSendMessageData) => {
        const broadcastData: BroadcastMessageData = {
            id: "",
            content: data.content,
            createdAt: new Date(),
            user: {
                id: data.user.id,
                name: data.user.name
            }
        }

        const project = await projectRepository.findOneBy({id: data.projectId});
        if (project) {
            const user = await userRepository.findOneBy({id: data.user.id});
            if (user) {
                const message = new Message();
                message.content = data.content;
                message.user = user;
                message.project = project;
                try {
                    const savedMessage = await messageRepository.save(message);
                    broadcastData.id = savedMessage.id;
                } catch (error) {

                }
            }
        }

        socket.to(data.projectId).emit("receive_msg", broadcastData);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

initDatabase()
    .then(() => {
        console.log(`Connected to database. Starting web server at ${new Date().toString()}...`)
        const serverPort = process.env.PORT || 3000
        server.listen(serverPort, () => {
            console.log(`Server running on port ${serverPort} (http://localhost:${serverPort})`);
        });
        initSocketIOServer(io);
    })
    .catch((error) => {
        console.error("Unable to connect to database. Stopping web server.", error)
    })