import loggerService from "./logger.service";

class AddressService {
  private static fetchUrl = "https://address.nerdstacks.org/";

  constructor() {}

  public async count(addressRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.request(addressRequest)
        .then((response) => {
          resolve({
            // ✅ FIX 2: correct count logic
            count: response.length,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

public async request(addressRequest?: any): Promise<any> {
    return fetch("https://address.nerdstacks.org/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(addressRequest), // addressRequest is already req.body
    }).then(res => res.json());
}

  public async distance(addressRequest?: any): Promise<any> {
    // Complete this
  }

  // private async getDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
  //     // Defining this function inside of this private method means it's
  //     // not accessible outside of it, which is perfect for encapsulation.
  //     const toRadians = (degrees: string) => {
  //         return degrees * (Math.PI / 180);
  //     }

  //     // Radius of the Earth in KM
  //     const R = 6371;

  //     // Convert Lat and Longs to Radians
  //     const dLat = toRadians(lat2 - lat1);
  //     const dLon = toRadians(lon2 - lon1);

  //     // Haversine Formula to calculate the distance between two locations
  //     // on a sphere.
  //     const a =
  //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
  //         Math.sin(dLon / 2) * Math.sin(dLon / 2);

  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //     // convert and return distance in KM
  //     return R * c;
  // }
}

export default new AddressService();
