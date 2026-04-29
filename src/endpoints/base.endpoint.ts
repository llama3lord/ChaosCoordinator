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

  /**
   * This code dynamically finds the correct function based on the route
   * and HTTP method. If the function doesn't exit then it returns 400 error.
   * If it does exist, it executes that function and passes in the request,
   * response, and next middleware.
   */
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
    //combine the original url (from splitted method) with the request's method (get, post, put, delete)
    //which turned into like users_get or login_post
    subRoute = `${subRoute}_${req.method.toLowerCase()}`;
    //The meaning of these codes below tell you that it find the functiont that matches this 
    //route + HTTP method (thus why you see the subroutes)
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
    //pass in the request/response
    temp.call(endPointMethod, req, res, next);
  }
}
export default BaseEndpoint;
