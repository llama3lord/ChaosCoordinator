import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import zipcodeService from "../services/zipcode.service";
import responseWrapper from "../services/response.service";

import {
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";

class ZipcodeEndpoint extends baseEndpoint {
  public post(req: Request, res: Response, next: NextFunction) {
    console.info("[INFO] Incoming POST request to ZipcodeEndpoint");
    return super.executeSubRoute(zipcodeEndpoint, req, res, next) as Response;
  }

  private async city_post(req: Request, res: Response, next: NextFunction) {
    try {
      console.info("[INFO] city_post transaction started");

      // Validate request
      if (!req || !req.body) {
        console.warn("[WARN] Missing request body in city_post");
        return res.status(400).send(
          responseWrapper(
            RESPONSE_STATUS_FAIL,
            RESPONSE_EVENT_READ,
            "Request body is required"
          )
        );
      }

      const { zipcode } = req.body;

      // Validate required field
      if (!zipcode) {
        console.warn("[WARN] Missing zipcode in request body");
        return res.status(400).send(
          responseWrapper(
            RESPONSE_STATUS_FAIL,
            RESPONSE_EVENT_READ,
            "Zipcode is required"
          )
        );
      }

      const city = await zipcodeService.getCityByZipcode(req.body);

      // Handle null / unexpected response
      if (!city) {
        console.warn("[WARN] No city found for given zipcode:", zipcode);
        return res.status(200).send(
          responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, {
            city: null,
          })
        );
      }

      console.info("[INFO] city_post transaction successful");

      return res.status(200).send(
        responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, { city })
      );
    } catch (err: any) {
      // Unexpected errors
      console.error("[ERROR] Exception in city_post:", err);

      return res.status(500).send(
        responseWrapper(
          RESPONSE_STATUS_FAIL,
          RESPONSE_EVENT_READ,
          "Internal server error"
        )
      );
    }
  }
}

const zipcodeEndpoint = new ZipcodeEndpoint();

const getRoute = zipcodeEndpoint.get;
const postRoute = zipcodeEndpoint.post;
const putRoute = zipcodeEndpoint.put;
const deleteRoute = zipcodeEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };