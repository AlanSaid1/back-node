"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imagesController_1 = require("../controllers/imagesController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get('/obtener', imagesController_1.getImages);
router.post('/ingresar', imagesController_1.uploadImage);
//processImages de ser necesario
exports.default = router;
//# sourceMappingURL=imagesRoutes.js.map