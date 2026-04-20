import { json } from "stream/consumers";
import loggerService from "./logger.service";
import { response } from "express";

class AddressService {
  private static fetchUrl = "https://address.nerdstacks.org/";

  constructor() {}

  /**
   * Counts addresses from the upstream service.
   * Handles null inputs and upstream data inconsistencies.
   */
  public async count(addressRequest?: any): Promise<any> {
    // 1. Check for null/undefined parameters from user
    if (!addressRequest) {
      loggerService.warning({ path: "AddressService.count", message: "User provided null or empty request body" });
      return { count: 0 }; // Handling bad data gracefully
    }

    try {
      // INFO: Log new transaction
      loggerService.info({ path: "AddressService.count", message: "Initiating address count transaction" });

      const response = await this.request(addressRequest);

      // 2. Check for bad data returned by the upstream endpoint
      if (!response || !Array.isArray(response)) {
        loggerService.warning({ path: "AddressService.count", message: "Upstream returned invalid or non-array data" });
        return { count: 0 };
      }

      return { count: response.length };
    } catch (err: any) {
      // ERROR: Unexpected exception caught
      loggerService.error({ path: "AddressService.count", message: `Unexpected failure: ${err.message}` });
      throw new Error("Internal Service Error"); // Handled further up the stack
    } finally {
      loggerService.flush();
    }
  }

  /**
   * Basic fetch wrapper with error boundary
   */
  public async request(addressRequest?: any): Promise<any> {
    const res = await fetch(AddressService.fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressRequest || {}),
    });

    if (!res.ok) {
      throw new Error(`Upstream error: ${res.statusText}`);
    }

    return await res.json();
  }

  /**
   * Calculates distance using the Haversine formula
   */
  public async distance(addressRequest?: any): Promise<any> {
    // 1. Validate user input
    if (!addressRequest?.from || !addressRequest?.to) {
      loggerService.warning({ path: "AddressService.distance", message: "Incomplete coordinates provided by user" });
      throw new Error("Missing 'from' or 'to' address parameters.");
    }

    try {
      loggerService.info({ path: "AddressService.distance", message: "Processing distance calculation transaction" });

      const { from, to } = addressRequest;
      const dist = this.getDistance(from.lat, from.lon, to.lat, to.lon);

      return {
        distance: dist,
        units: "km"
      };
    } catch (err: any) {
      loggerService.error({ path: "AddressService.distance", message: `Calculation error: ${err.message}` });
      throw err;
    } finally {
      loggerService.flush();
    }
  }

  /**
   * Logic for Haversine distance calculation
   */
  private getDistance(lat1: any, lon1: any, lat2: any, lon2: any): number {
    // Null check for internal calculation
    if ([lat1, lon1, lat2, lon2].some(coord => coord === null || coord === undefined)) {
      throw new Error("Invalid coordinate values: null or undefined detected.");
    }

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in KM

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export default new AddressService();