import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ENV } from './constants/environment-vars.constants';

const router = express.Router();

router.get('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).getRoute(req, res, next);
});

router.post('*', (req: Request, res: Response, next: NextFunction) => {
    try {
        (require(getEndpointControllerPath(req))).postRoute(req, res, next);
    } catch (err) {
        res.status(400).send({ error: { status: 400, message: "Invalid Request" } });
    }
});

router.put('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).putRoute(req, res, next);
});

router.delete('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).deleteRoute(req, res, next);
});

/**
 * returns the string path to an endpoint 
 * throws an error if the requests path is too short or if the endpoint doesn't exist or if the endpoint starts with base
 */
function getEndpointControllerPath(req: Request): string {
    const paths = req.path.split('/');
    const ext = (ENV === 'dev') ? 'ts' : 'js';
    const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;

    if (paths.length < 2 || !fs.existsSync(route) || paths[1] == 'base') {
        throw new createHttpError.BadRequest();
    }

    return route;
}

export default router;
