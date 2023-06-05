import * as fs from "fs";
import { Request, Response } from "express";
import db from '../models/index';
import path from "path";
import AbstractController from "./abstractController";

const { uploadFile, getFileStream } = require("../config/s3");
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const multer = require('multer');
//----------------------------------------------------------------------
//singleton
class ImagesController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }

  private static instance: ImagesController;

  public static getInstance(): ImagesController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ImagesController("file");
    return this.instance;
  }
//----------------------------------------------------------------------
  protected initRoutes(): void {
    const setDestination = (req: Request, file: any, cb: any) => {
      let destination = `./dist/uploads`;
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    };

    const upload = multer({
      storage: multer.diskStorage({
        destination: setDestination,
        filename: function (req: Request, file: any, cb: any) {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileName = uniqueSuffix + "-" + req.body.agency_name + "-" + file.originalname;
          console.log(fileName);
          cb(null, fileName);
        },
      }),
    });

    this.router.post("/subirDocumentos", upload.array('file', 3), this.subirDocumentos.bind(this));
    this.router.get("/verificarDocumentos", this.verificarDocumentos.bind(this));
  }
//-----------------------------------------------------------------------------------------------------
private async subirDocumentos(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[];
  const imageUrls: string[] = [];

  const uploadFiles = async () => {
    for (const file of files) {
      try {
        const result = await uploadFile(file);
        console.log(result);
        const key = result.key;
        const url = getFileStream(key).pipe(res);

        // Aquí defines si la imagen es válida o no según tus criterios
        const isValid = false;

        // Almacenar la key, el parámetro isValid y la URL en la base de datos
        await db.sequelize.query(
          `INSERT INTO docsValidar (image_key, is_valid, url) VALUES (:key, :isValid, :url)`,
          {
            replacements: {
              key: key,
              isValid: isValid,
              url: url,
            },
            type: db.sequelize.QueryTypes.INSERT,
          }
        );

        await unlinkFile(file.path);

        // Agregar la URL al arreglo de imageUrls
        imageUrls.push(url);
      } catch (error) {
        console.error("Error al subir tus documentos", error);
        return res.status(500).send("Error en el almacenamiento de los archivos");
      }
    }

    return res.json({ images: imageUrls });
  };

  uploadFiles();
}


//----------------------------------------------------------------------
private async verificarDocumentos(req: Request, res: Response) {
  try {
    // Consultar la base de datos para obtener las claves de las imágenes
    const [results, metadata] = await db.sequelize.query(
      `SELECT image_key, is_valid FROM docsvalidar`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    // Recorrer los resultados y obtener las claves de las imágenes
    const imageKeys = results.map((result: any) => result.image_key);

    // Obtener las imágenes desde el servicio de almacenamiento y enviarlas como respuesta
    const imagePromises = imageKeys.map((key: string) => getFileStream(key));
    const images = await Promise.all(imagePromises);

    // Adjuntar las imágenes a la respuesta
    images.forEach((image: any) => image.pipe(res));
  } catch (error) {
    console.error("Error al verificar los documentos", error);
    res.status(500).send("Error al verificar los documentos");
  }
}

}

export default ImagesController;
