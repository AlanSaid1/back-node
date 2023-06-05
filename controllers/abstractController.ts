import {Router} from 'express';

export default abstract class AbstractController{
    private _router:Router = Router();
    private _prefix:string;

    public get prefix():string{
        return this._prefix;
    }

    public get router():Router{
        return this._router
    }

    protected constructor(prefix:string){
        this._prefix=prefix;
        this.initRoutes();

    }

    //Inicializar rutas
    protected abstract initRoutes():void;
    //Validar el body de la petición
    protected abstract validateBody(type:any):any;

}