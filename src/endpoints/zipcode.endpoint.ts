import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import zipcodeService from "../services/zipcode.service";
import responseWrapper from "../services/response.service";
import {
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";

/**
 * This function is very similar to the AddressEndpoint function
 * from address.endpoint.ts file.
 */
class ZipcodeEndpoint extends baseEndpoint {
    public post(req: Request, res: Response, next: NextFunction) {
        return super.executeSubRoute(zipcodeEndpoint, req, res, next) as Response;
    }

  private city_post(req: Request, res: Response, next: NextFunction) {
    zipcodeService
      .getCityByZipcode(req.body)
      .then((city) => {
        res.status(200).send(
          responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, { city })
        );
      })
      .catch((err: Error) => {
        res.status(400).send(
          responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, { message: err.message })
        );
      });
  }
}

const zipcodeEndpoint = new ZipcodeEndpoint();

const getRoute = zipcodeEndpoint.get;
const postRoute = zipcodeEndpoint.post;
const putRoute = zipcodeEndpoint.put;
const deleteRoute = zipcodeEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };