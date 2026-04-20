import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import responseWrapper from "../services/response.service";

import {
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";
// yooasrngvoaerngvo
// hi
class AddressEndpoint extends baseEndpoint {
<<<<<<< HEAD
    public post(req: Request, res: Response, next: NextFunction) {
        return super.executeSubRoute(addressEndpoint, req, res, next);
    }

    private count_post(req: Request, res: Response, next: NextFunction) {
        addressService.count(req)
            .then((response) => {
                res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
            }).catch((err) => {
                res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
            });
    }

    private request_post(req: Request, res: Response, next: NextFunction) {
        //console.log("touch request func");
        addressService.request(req)
            .then((response) => {
                res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
            }).catch((err) => {
                res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
            });
    }

    private distance_post(req: Request, res: Response, next: NextFunction){
        //console.log("Touch distance func");

        addressService.distance(req)
            .then((response) => {
                res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
            }).catch((err) => {
                res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
            });
    }
=======
  public post(req: Request, res: Response, next: NextFunction) {
    super.executeSubRoute(addressEndpoint, req, res, next);
  }

 private count_post(req: Request, res: Response, next: NextFunction) {
    addressService.count(req.body)
        .then(response => {
            res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
        })
        .catch(err => {
            res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
        });
}
  private request_post(req: Request, res: Response, next: NextFunction) {
    addressService
      .count(req.body)
      .then((response) => {
        res
          .status(200)
          .send(
            responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response),
          );
      })
      .catch((err) => {
        res
          .status(400)
          .send(
            responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err),
          );
      });
  }
>>>>>>> origin/zhijun
}

const addressEndpoint = new AddressEndpoint();

const getRoute = addressEndpoint.get;
const postRoute = addressEndpoint.post;
const putRoute = addressEndpoint.put;
const deleteRoute = addressEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };
