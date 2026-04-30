import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import responseWrapper from "../services/response.service";

//Pull the constants variable from the generic file in constants folder.
import {
    RESPONSE_STATUS_OK,
    RESPONSE_STATUS_FAIL,
    RESPONSE_EVENT_READ,
} from "../constants/generic.constants";

/**
 * This class have post functions that allow the application to
 * return the JSON result from post request.
 * Without these functions, you will receive an invalid request/failed status.
 */
class AddressEndpoint extends baseEndpoint {
    public post(req: Request, res: Response, next: NextFunction) {
        return super.executeSubRoute(addressEndpoint, req, res, next);
    }

    /**
     * Each post functions below allow you to request the specific url
     * to return the json result (200) or return error (400) if issues occurs
     * (e.g. "../address/count", "../address/request", "../address/distance")
     */

    private count_post(req: Request, res: Response, next: NextFunction) {
        addressService.count(req)
            .then((response) => {
                res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
            }).catch((err) => {
                res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
            });
    }

    
    private request_post(req: Request, res: Response, next: NextFunction) {
        addressService.request(req)
            .then((response) => {
                res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
            }).catch((err) => {
                res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
            });
    }

    private distance_post(req: Request, res: Response, next: NextFunction) {
        addressService.distance(req)
            .then((response) => {
                res.status(200).send(responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response));
            }).catch((err) => {
                res.status(400).send(responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err));
            });
    }
}

const addressEndpoint = new AddressEndpoint();

const getRoute = addressEndpoint.get;
const postRoute = addressEndpoint.post;
const putRoute = addressEndpoint.put;
const deleteRoute = addressEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };
