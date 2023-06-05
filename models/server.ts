import express, { Request, Response } from "express";
import AbstractController from "../controllers/abstractController";
import db from "../models";

class Server {
    private app: express.Application;
    private port: number;
    private env: string;

    constructor(appInit: {
        port: number;
        env: string;
        middlewares: any[];
        controllers: AbstractController[];
    }) {
        this.app = express();
        this.port = appInit.port;
        this.env = appInit.env;
        this.loadMiddlewares(appInit.middlewares);
        this.loadControllers(appInit.controllers);
    }

    private async loadControllers(controllers: AbstractController[]) {
        await controllers.forEach((controller: AbstractController) => {
            this.app.use(`/${controller.prefix}`, controller.router);
        });
    }

    private async loadMiddlewares(middlewares: any[]) {
        await middlewares.forEach((middleware: any) => {
            this.app.use(middleware);
        });
    }

    private async connectDB() {
        try {
            await db.sequelize.authenticate();
            console.log("Connection has been established successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    }

    public async init() {
        await this.connectDB();
        this.app.listen(this.port, () => {
            console.log(
                `Server::Running 🚀 😱 @'http://localhost:${this.port}'`
            );
        });
    }
}

export default Server;
