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
        console.log(requestUrl)
        return Promise.resolve(requestUrl);
    });
}

export const fetchTemperature = async (url: string): Promise<interfaces.temperatureSensorValue[]> => {
    const response = await fetch(url);
    const temperatures = response.json();
    return temperatures
}

export const getTemperature = async (): Promise<interfaces.temperatureSensorValue[]> => {
    let requestUrl = "http://192.168.3.105/api/v1/realtime/sensor?"

    let response = await fetch('http://192.168.3.105/api/v1/sensors');
    const sensors: interfaces.sensor[] = await response.json();
    sensors.forEach((sensor) => {
        if (sensor.id.includes("IAQsensor")) {
            requestUrl += "&id=" + sensor.id;
        }
    })

    response = await fetch(requestUrl);
    const temperatures = response.json();

    await console.log(temperatures)
    return temperatures
}
export default api;