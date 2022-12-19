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
        return requestUrl;
    });
}

export const fetchTemperature = async (url: string): Promise<interfaces.temperatureSensorValue[]> => {
    const response = await fetch(url);
    const temperatures = response.json();
    return temperatures
}

export const getTemperature = async (): Promise<interfaces.temperatureSensorValue[]> => {
    let temperatureValues: interfaces.temperatureSensorValue[] = []
    await getTemperatureSensorUrl().then(async (url: string) => {
        await console.log(url)
        fetchTemperature(url).then(async (temperatureSensors: interfaces.temperatureSensorValue[]) => {
            await console.log(temperatureSensors);
            temperatureValues = temperatureSensors;
        })
    })
    await console.log(temperatureValues)
    return temperatureValues
}
export default api;