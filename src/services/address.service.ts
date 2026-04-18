import { json } from "stream/consumers";
import loggerService from "./logger.service";
import { response } from "express";

class AddressService {
    private static fetchUrl = 'https://address.nerdstacks.org/';
    private static fetchUrl2 = 'https://ischool.gccis.rit.edu/addresses/';
    private static fetchDist = 'http//localhost:4900/distance';

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

    //Temporarily for now - like the request function, you can get data
    //through zipcode post request, but will show the distance between the first 2 location.
    public async distance(addressRequest?: any): Promise<any>{
        // Complete this
        return new Promise<any>(async (resolve, reject) => {
            //temporarily solution b/c the instruction is a bit unclear
            this.distUrl(addressRequest)
            .then((response) => {
                const dataList = response;
                const data1 = dataList.pop();
                const data2 = dataList.pop();

                const calcDist = this.getDistance(data1.latitude, data1.longitude, data2.latitude, data2.longitude);

                return calcDist;
            })
            .then((dist) => {
                resolve({"KM" : dist[0], "M" : dist[1]});
            })
            .catch((err) => {
                    loggerService.error({ path: "/address/request", message: `${(err as Error).message}` }).flush();
                    reject(err);
            });
        });
    }

    public async distUrl(addressRequest?: any): Promise<any> {
        //console.log("Touch this function");
        return new Promise<any>(async (resolve, reject) => {            
            fetch(AddressService.fetchUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(addressRequest.body)
            })
                .then(async (response) => {
                    //old codes for experiments and testing

                    // const dataList = await response.json();
                    // //console.log(data);
                    // const data1 = dataList.pop();
                    // console.log(data1.latitude ?? "Null");
                    // const data2 = dataList.pop();
                    // //const distance = await this.getDistance(data[0], data[0].lon, data[1].lat, data[1].lon);
                    // resolve(dataList.pop());

                    resolve(await response.json());
                })
                .catch((err) => {
                    loggerService.error({ path: "/distance", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    private async getDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
        // Defining this function inside of this private method means it's
        // not accessible outside of it, which is perfect for encapsulation.
        const toRadians = (degrees: number) => {
            return degrees * (Math.PI / 180);
        }

        // Radius of the Earth in KM
        const R = 6371;

        //Radius of the Earth in Miles
        const mileR = 3958.8;

        // Convert Lat and Longs to Radians
        const dLat = toRadians(Number(lat2) - Number(lat1));
        const dLon = toRadians(Number(lon2) - Number(lon1));

        // Haversine Formula to calculate the distance between two locations
        // on a sphere.
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(Number(lat1))) * Math.cos(toRadians(Number(lat2))) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


        // convert and return distance in KM
        return [R * c, mileR * c];
    }
}

export default new AddressService();