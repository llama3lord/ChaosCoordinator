import loggerService from "./logger.service";
import fetch from 'node-fetch';

class ZipcodeService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  /**
   * Looks up the city name for a given zip code.
   * Only accepts zipcode, rejects any other fields.
   */
  public async getCityByZipcode(requestBody: any): Promise<string> {
    // Null / missing check
    if (!requestBody || requestBody.zipcode === undefined || requestBody.zipcode === null) {
      loggerService.warn({
        path: "ZipcodeService.getCityByZipcode",
        message: "User provided null or missing zipcode"
      }).flush();
      throw new Error("zipcode is required");
    }

    const zipcode = String(requestBody.zipcode).trim();

    if (zipcode === "") {
      loggerService.warn({
        path: "ZipcodeService.getCityByZipcode",
        message: "User provided empty zipcode string"
      }).flush();
      throw new Error("zipcode cannot be empty");
    }

    // Reject any extra fields beyond zipcode
    const allowedKeys = ["zipcode"];
    const extraKeys = Object.keys(requestBody).filter(k => !allowedKeys.includes(k));
    if (extraKeys.length > 0) {
      loggerService.warn({
        path: "ZipcodeService.getCityByZipcode",
        message: `User provided extra fields that will be ignored: ${extraKeys.join(", ")}`
      }).flush();
    }

    loggerService.info({
      path: "ZipcodeService.getCityByZipcode",
      message: `Looking up city for zipcode: ${zipcode}`
    }).flush();

    try {
      const response = await fetch(ZipcodeService.fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipcode })  // only send zipcode, nothing else
      });

      if (!response.ok) {
        loggerService.error({
          path: "ZipcodeService.getCityByZipcode",
          message: `Upstream error: ${response.statusText}`
        }).flush();
        throw new Error(`Upstream error: ${response.statusText}`);
      }

      const data = await response.json();

      // Upstream returned bad/empty data
      if (!data || !Array.isArray(data) || data.length === 0) {
        loggerService.warn({
          path: "ZipcodeService.getCityByZipcode",
          message: `No results returned for zipcode: ${zipcode}`
        }).flush();
        throw new Error(`No city found for zipcode: ${zipcode}`);
      }

      const city = data[0]?.city;

      if (!city) {
        loggerService.warn({
          path: "ZipcodeService.getCityByZipcode",
          message: `Upstream result missing city field for zipcode: ${zipcode}`
        }).flush();
        throw new Error(`City data unavailable for zipcode: ${zipcode}`);
      }

      loggerService.info({
        path: "ZipcodeService.getCityByZipcode",
        message: `Successfully resolved zipcode ${zipcode} to city: ${city}`
      }).flush();

      return city;

    } catch (err: any) {
      // Only log as error if it wasn't already a known/handled warn case
      if (!err.message.startsWith("No city") && !err.message.startsWith("Upstream") && !err.message.startsWith("City data")) {
        loggerService.error({
          path: "ZipcodeService.getCityByZipcode",
          message: `Unexpected exception: ${err.message}`
        }).flush();
      }
      throw err;
    }
  }
}

export default new ZipcodeService();