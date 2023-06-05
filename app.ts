import Server from './models/server';
import express from "express";
import cors from "cors";

import imagesController from "./controllers/imagesController";

const app = new Server({
    port: 8080,
    middlewares: [
        express.json(),
        express.urlencoded({ extended: true }),
        cors(),
    ],
    controllers: [imagesController.getInstance()],
    env: "development",
});

app.init();