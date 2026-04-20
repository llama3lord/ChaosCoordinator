import loggerService from "./logger.service";

class ZipcodeService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  /**
   * Looks up the city name for a given zip code.
   * Only accepts a zipcode string.
   */
  public async getCityByZipcode(zipcodeInput: any): Promise<string> {
    // Normalize input
    if (zipcodeInput === undefined || zipcodeInput === null) {
      loggerService.warning({
        path: "ZipcodeService.getCityByZipcode",
        message: "User provided null or missing zipcode"
      }).flush();
      throw new Error("zipcode is required");
    }

    const zipcode = String(zipcodeInput).trim();

    if (zipcode === "") {
      loggerService.warning({
        path: "ZipcodeService.getCityByZipcode",
        message: "User provided empty zipcode string"
      }).flush();
      throw new Error("zipcode cannot be empty");
    }

    loggerService.info({
      path: "ZipcodeService.getCityByZipcode",
      message: `Looking up city for zipcode: ${zipcode}`
    }).flush();

    try {
      const response = await fetch(ZipcodeService.fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipcode })
      });

      // Upstream failure
      if (!response.ok) {
        loggerService.error({
          path: "ZipcodeService.getCityByZipcode",
          message: `Upstream error: ${response.status} ${response.statusText}`
        }).flush();

        throw new Error("Failed to fetch zipcode data");
      }

      const data = await response.json();

      // No results
      if (!data || !Array.isArray(data) || data.length === 0) {
        loggerService.warning({
          path: "ZipcodeService.getCityByZipcode",
          message: `No results returned for zipcode: ${zipcode}`
        }).flush();

        throw new Error(`No city found for zipcode: ${zipcode}`);
      }

      const city = data[0]?.city;

      // Missing expected field
      if (!city) {
        loggerService.warning({
          path: "ZipcodeService.getCityByZipcode",
          message: `Missing city field for zipcode: ${zipcode}`
        }).flush();

        throw new Error(`City data unavailable for zipcode: ${zipcode}`);
      }

      loggerService.info({
        path: "ZipcodeService.getCityByZipcode",
        message: `Resolved ${zipcode} → ${city}`
      }).flush();

      return city;

    } catch (err: any) {
      // Only log unexpected errors here
      if (
        err.message !== "zipcode is required" &&
        err.message !== "zipcode cannot be empty" &&
        !err.message.startsWith("No city") &&
        !err.message.startsWith("City data")
      ) {
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