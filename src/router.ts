import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ENV } from './constants/environment-vars.constants';

const router = express.Router();

//console.log("Did it goes through here router?"); //yes, before the error msg/get request

router.get('*', (req: Request, res: Response, next: NextFunction) => {
    console.log("hello router get method");
    (require(getEndpointControllerPath(req))).getRoute(req, res, next);
});

router.post('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).postRoute(req, res, next);
});

router.put('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).putRoute(req, res, next);
});

router.delete('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).deleteRoute(req, res, next);
});

function getEndpointControllerPath(req: Request): string {
    // const paths = req.baseUrl.split('/');

    const endpoint = req.baseUrl.split('/').pop();


    const ext = (ENV === 'dev') ? 'ts' : 'js';
    const route = `${__dirname}/endpoints/${endpoint}.endpoint.${ext}`;
        
    if (!endpoint || !fs.existsSync(route) || endpoint == 'base') {
        throw new createHttpError.BadRequest();
    }

    return route;
}

export default router;