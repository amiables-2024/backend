import 'dotenv/config'
import "reflect-metadata"

import express, {Express} from 'express';
import cors from "cors";
import {routesRouter} from "./routes/routes";
import {initDatabase} from "./database/database";

const app: Express = express();

app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(routesRouter);

initDatabase()
    .then(() => {
        console.log(`Connected to database. Starting web server at ${new Date().toString()}...`)
        const serverPort = process.env.PORT || 3000
        app.listen(serverPort, () => {
            console.log(`Server running on port ${serverPort} (http://localhost:${serverPort})`);
        });
    })
    .catch((error) => {
        console.error("Unable to connect to database. Stopping web server.", error)
    })