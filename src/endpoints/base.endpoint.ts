import { NextFunction, Request, Response } from "express";
import responseWrapper from "../services/response.service";
import {
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";
import { INVALID_REQUEST } from "../constants/errors.constants";
import createHttpError from "http-errors";
class BaseEndpoint {
  private readonly extensions = new Map<string, string>([
    ["dev", ".ts"],
    ["prod", ".js"],
  ]);
  public constructor() {}
  public get(req: Request, res: Response, next: NextFunction): any {
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
  public post(req: Request, res: Response, next: NextFunction): any {
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
  public put(req: Request, res: Response, next: NextFunction): any {
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
  public delete(req: Request, res: Response, next: NextFunction): any {
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
  public executeSubRoute(
    endPointMethod: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let subRoute = req.originalUrl.split("/")[2];
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
    subRoute = `${subRoute}_${req.method.toLowerCase()}`;
    const temp = endPointMethod[subRoute as keyof typeof endPointMethod];
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
    temp.call(endPointMethod, req, res, next);
  }
}
export default BaseEndpoint;