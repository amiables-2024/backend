import 'dotenv/config'

import express, {Express} from 'express';
import cors from "cors";
import {routesRouter} from "./routes/routes";

const app: Express = express();

app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(routesRouter);

const serverPort = process.env.PORT || 3000
app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort} (http://localhost:${serverPort})`);
});