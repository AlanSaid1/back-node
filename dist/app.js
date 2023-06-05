"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./models/server"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const imagesController_1 = __importDefault(require("./controllers/imagesController"));
const app = new server_1.default({
    port: 8080,
    middlewares: [
        express_1.default.json(),
        express_1.default.urlencoded({ extended: true }),
        (0, cors_1.default)(),
    ],
    controllers: [imagesController_1.default.getInstance()],
    env: "development",
});
app.init();
//# sourceMappingURL=app.js.map