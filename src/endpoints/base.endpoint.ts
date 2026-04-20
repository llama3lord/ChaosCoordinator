import { NextFunction, Request, Response } from "express";
import responseWrapper from "../services/response.service";
import {
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";
import { INVALID_REQUEST } from "../constants/errors.constants";
import createHttpError from "http-errors";
<<<<<<< HEAD
class BaseEndpoint {
  private readonly extensions = new Map<string, string>([
    ["dev", ".ts"],
    ["prod", ".js"],
  ]);
  public constructor() {}
  public get(req: Request, res: Response, next: NextFunction): any {
=======

class BaseEndpoint {
  private readonly extensions = new Map<string, string>([
    ["dev", ".js"],
    ["prod", ".ts"],
  ]);

  public constructor() {}

  public get(req: Request, res: Response, next: NextFunction) {
>>>>>>> origin/zhijun
    return res
      .status(400)
      .send(
        responseWrapper(
          RESPONSE_STATUS_FAIL,
          RESPONSE_EVENT_READ,
          INVALID_REQUEST,
        ),
      );
  }
<<<<<<< HEAD
  public post(req: Request, res: Response, next: NextFunction): any {
=======

  public post(req: Request, res: Response, next: NextFunction) {
>>>>>>> origin/zhijun
    return res
      .status(400)
      .send(
        responseWrapper(
          RESPONSE_STATUS_FAIL,
          RESPONSE_EVENT_READ,
          INVALID_REQUEST,
        ),
      );
  }
<<<<<<< HEAD
  public put(req: Request, res: Response, next: NextFunction): any {
=======

  public put(req: Request, res: Response, next: NextFunction) {
>>>>>>> origin/zhijun
    return res
      .status(400)
      .send(
        responseWrapper(
          RESPONSE_STATUS_FAIL,
          RESPONSE_EVENT_READ,
          INVALID_REQUEST,
        ),
      );
  }
<<<<<<< HEAD
  public delete(req: Request, res: Response, next: NextFunction): any {
=======

  public delete(req: Request, res: Response, next: NextFunction) {
>>>>>>> origin/zhijun
    return res
      .status(400)
      .send(
        responseWrapper(
          RESPONSE_STATUS_FAIL,
          RESPONSE_EVENT_READ,
          INVALID_REQUEST,
        ),
      );
  }
<<<<<<< HEAD
=======

>>>>>>> origin/zhijun
  public executeSubRoute(
    endPointMethod: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let subRoute = req.originalUrl.split("/")[2];
<<<<<<< HEAD
=======

>>>>>>> origin/zhijun
    if (!subRoute) {
      return res
        .status(400)
        .send(
          responseWrapper(
            RESPONSE_STATUS_FAIL,
            RESPONSE_EVENT_READ,
            INVALID_REQUEST,
          ),
        );
    }
<<<<<<< HEAD
    subRoute = `${subRoute}_${req.method.toLowerCase()}`;
    const temp = endPointMethod[subRoute as keyof typeof endPointMethod];
=======

    subRoute = `${subRoute}_${req.method.toLowerCase()}`;

    const temp = endPointMethod[subRoute as keyof typeof endPointMethod];

>>>>>>> origin/zhijun
    if (!temp) {
      return res
        .status(400)
        .send(
          responseWrapper(
            RESPONSE_STATUS_FAIL,
            RESPONSE_EVENT_READ,
            INVALID_REQUEST,
          ),
        );
    }
<<<<<<< HEAD
    temp.call(endPointMethod, req, res, next);
  }
}
export default BaseEndpoint;
=======

    temp.call(endPointMethod, req, res, next);
  }
}

export default BaseEndpoint;
>>>>>>> origin/zhijun
