import loggerService from "./logger.service";

class AddressService {
    private static fetchUrl = 'https://address.nerdstacks.org/';

    constructor() { }

    /**
     * counts the number of addresses from a request object
     * logs a warning if the request is missing or invalid
     * returns a count of the addresses
     */
    public async count(addressRequest?: any): Promise<any> {
        if (!addressRequest) {
            loggerService.warning({ path: "AddressService.count", message: "User provided null or empty request" }).flush();
            return { count: 0 };
        }

        try {
            loggerService.info({ path: "AddressService.count", message: "Initiating address count transaction" }).flush();

            const response = await this.request(addressRequest);

            if (!response || !Array.isArray(response)) {
                loggerService.warning({ path: "AddressService.count", message: "Upstream returned invalid or non-array data" }).flush();
                return { count: 0 };
            }

            return { count: response.length };
        } catch (err: any) {
            loggerService.error({ path: "AddressService.count", message: `Unexpected failure: ${err.message}` }).flush();
            throw new Error("Internal Service Error");
        }
    }

    /**
     * sends a POST request to the provided address service
     * logs and throws an error if the response is not ok
     * returns the json response from the request
     */
    public async request(addressRequest?: any): Promise<any> {
        const res = await fetch(AddressService.fetchUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addressRequest?.body || {}),
        });

        if (!res.ok) {
            loggerService.error({ path: "/address/request", message: `Upstream error: ${res.statusText}` }).flush();
            throw new Error(`Upstream error: ${res.statusText}`);
        }

        return await res.json();
    }

    /**
     * calculates the distance between two address coordinates
     * returns an array containing the distance in both kilometers and miles
     */
    public async distance(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.distUrl(addressRequest)
                .then((response) => {
                    const dataList = response;
                    const data1 = dataList.pop();
                    const data2 = dataList.pop();

                    const calcDist = this.getDistance(data1.latitude, data1.longitude, data2.latitude, data2.longitude);

                    return calcDist;
                })
                .then((dist) => {
                    resolve({ "KM": dist[0], "M": dist[1] });
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/distance", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    /**
     * sends a POST request to the address.nerdstacks.org service and returns the json response
     */
    public async distUrl(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressRequest?.body || {})
            })
                .then(async (response) => {
                    resolve(await response.json());
                })
                .catch((err) => {
                    loggerService.error({ path: "/distance", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    /**
     * calculates the distance between two lat/lon coordinates on the earth and returns the result
     */
    private getDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
        const toRadians = (degrees: number) => {
            return degrees * (Math.PI / 180);
        }

        // Radius of the Earth in KM
        const R = 6371;

        // Radius of the Earth in Miles
        const mileR = 3958.8;

        const dLat = toRadians(Number(lat2) - Number(lat1));
        const dLon = toRadians(Number(lon2) - Number(lon1));

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(Number(lat1))) * Math.cos(toRadians(Number(lat2))) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return [R * c, mileR * c];
    }
}

export default new AddressService();
