//Alan Said Martinez Guzman A01746210

import * as fs from "fs";
import { Request, Response } from "express";
import db from "../models/index";
import path from "path";
import AbstractController from "./abstractController";
import { uploadFile, getFileStream } from "../config/s3";
import util from "util";

const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");

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
//-----------------------------------------------------------------------
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
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileName = uniqueSuffix + "-" + "-" + file.originalname;
          console.log(fileName);
          cb(null, fileName);
        },
      }),
    });

    this.router.post(
      "/subirDocumentos",
      upload.array("file", 3),
      this.subirDocumentos.bind(this)
    );
    this.router.get("/verificarDocumentos", this.verificarDocumentos.bind(this));
  }

  private async subirDocumentos(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];
  
    //------------------------------------------------------------------
    const uploadFiles = async () => {
      try {
        const uploadPromises = files.map(async (file) => {
          const result = await uploadFile(file);
          console.log(result);
          const key = result.Key;
          const url = getFileStream(key).pipe(res);
  
          // Aquí defines si la imagen es válida o no según tus criterios
          const isValid = false;
  
          // Almacenar la key, el parámetro isValid y la URL en la base de datos
          await db.sequelize.query(
            `INSERT INTO docsValidar (key, user) VALUES (:key, :user)`,
            {
              replacements: {
                key: key,
                user: req.body.user,
              },
              type: db.sequelize.QueryTypes.INSERT,
            }
          );
  
          await unlinkFile(file.path);
  
          // Agregar la URL al arreglo de imageUrls
          imageUrls.push(url);
        });
  
        await Promise.all(uploadPromises);
  
        return res.json({ images: imageUrls });
      } catch (error) {
        console.error("Error al subir tus documentos", error);
      }
    };
  
    uploadFiles();
  }
  //--------------------------------------------------------------------
  private async verificarDocumentos(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const [results, metadata] = await db.sequelize.query(
        `SELECT image_key, is_valid FROM docsvalidar WHERE email = :email`,
        {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: { email },
        }
      );

      const imageKeys = results.map((result: any) => result.image_key);

      const imagePromises = imageKeys.map((key: string) => getFileStream(key));
      const images = await Promise.all(imagePromises);

      images.forEach((image: any) => image.pipe(res));
    } catch (error) {
      console.error("Error al verificar los documentos", error);
      res.status(500).send("Error al verificar los documentos");
    }
  }
}

export default ImagesController;