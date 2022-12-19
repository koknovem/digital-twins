import * as interfaces from './interfaces';
function api() {

}

export const fetchSensors = async (): Promise<interfaces.sensor[]> => {
    const response = await fetch('http://192.168.3.105/api/v1/sensors');
    const sensors: interfaces.sensor[] = await response.json();
    return sensors;
}

export const fetchZones = async (): Promise<interfaces.zone[]> => {
    const response = await fetch('http://192.168.3.105/api/v1/zones');
    const zones: interfaces.zone[] = await response.json();
    return zones;
}


export const getTemperatureSensorUrl = async (): Promise<string> => {
    let requestUrl = "http://192.168.3.105/api/v1/realtime/sensor?"
    await fetchSensors().then((sensors: interfaces.sensor[]) => {
        sensors.forEach((sensor) => {
            if (sensor.id.includes("IAQsensor")) {
                requestUrl += "&id=" + sensor.id;
            }
        })
    });
    return Promise.resolve(requestUrl);
}

export const fetchTemperature = async (url: string): Promise<interfaces.temperatureSensorValue[]> => {
    const response = await fetch(url);
    const temperatures = response.json();
    return temperatures
}

export const getTemperature = (): interfaces.temperatureSensorValue[] => {
    let requestUrl: string;
    let temperatureValues: interfaces.temperatureSensorValue[] = []
    getTemperatureSensorUrl().then((url: string) => {
        requestUrl = url
        fetchTemperature(requestUrl).then((temperatureSensors: interfaces.temperatureSensorValue[]) => {
            temperatureValues = temperatureSensors
        })
    })
    return temperatureValues
}
export default api;