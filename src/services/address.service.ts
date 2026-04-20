import loggerService from "./logger.service";

class AddressService {
    private static fetchUrl = 'https://address.nerdstacks.org/';

    constructor() { }

    public async count(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.request(addressRequest)
                .then((response) => {
                    resolve({
                        "count": response.length
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public async request(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressRequest.body)
            })
                .then(async (response) => {
                    resolve(await response.json());
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/request", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

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
                    loggerService.error({ path: "/address/request", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    public async distUrl(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressRequest.body)
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
