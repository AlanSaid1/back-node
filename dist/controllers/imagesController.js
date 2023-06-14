"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const index_1 = __importDefault(require("../models/index"));
const abstractController_1 = __importDefault(require("./abstractController"));
const s3_1 = require("../config/s3");
const util_1 = __importDefault(require("util"));
const unlinkFile = util_1.default.promisify(fs.unlink);
const multer = require("multer");
class ImagesController extends abstractController_1.default {
    validateBody(type) {
        throw new Error("Method not implemented.");
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ImagesController("file");
        return this.instance;
    }
    initRoutes() {
        const setDestination = (req, file, cb) => {
            let destination = `./dist/uploads`;
            fs.mkdirSync(destination, { recursive: true });
            cb(null, destination);
        };
        const upload = multer({
            storage: multer.diskStorage({
                destination: setDestination,
                filename: function (req, file, cb) {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const fileName = uniqueSuffix + "-" + "-" + file.originalname;
                    console.log(fileName);
                    cb(null, fileName);
                },
            }),
        });
        this.router.post("/subirDocumentos", upload.array("file", 3), this.subirDocumentos.bind(this));
        this.router.get("/verificarDocumentos", this.verificarDocumentos.bind(this));
    }
    subirDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const imageUrls = [];
            const uploadFiles = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const uploadPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                        const result = yield (0, s3_1.uploadFile)(file);
                        console.log(result);
                        const key = result.Key;
                        const url = (0, s3_1.getFileStream)(key).pipe(res);
                        // Aquí defines si la imagen es válida o no según tus criterios
                        const isValid = false;
                        // Almacenar la key, el parámetro isValid y la URL en la base de datos
                        yield index_1.default.sequelize.query(`INSERT INTO docsValidar (image_key, is_valid, url) VALUES (:key, :isValid, :url)`, {
                            replacements: {
                                key: key,
                                isValid: isValid,
                                url: url,
                            },
                            type: index_1.default.sequelize.QueryTypes.INSERT,
                        });
                        yield unlinkFile(file.path);
                        // Agregar la URL al arreglo de imageUrls
                        imageUrls.push(url);
                    }));
                    yield Promise.all(uploadPromises);
                    return res.json({ images: imageUrls });
                }
                catch (error) {
                    console.error("Error al subir tus documentos", error);
                }
            });
            uploadFiles();
        });
    }
    verificarDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, metadata] = yield index_1.default.sequelize.query(`SELECT image_key, is_valid FROM docsvalidar`, {
                    type: index_1.default.sequelize.QueryTypes.SELECT,
                });
                const imageKeys = results.map((result) => result.image_key);
                const imagePromises = imageKeys.map((key) => (0, s3_1.getFileStream)(key));
                const images = yield Promise.all(imagePromises);
                images.forEach((image) => image.pipe(res));
            }
            catch (error) {
                console.error("Error al verificar los documentos", error);
                res.status(500).send("Error al verificar los documentos");
            }
        });
    }
}
exports.default = ImagesController;
//# sourceMappingURL=imagesController.js.map