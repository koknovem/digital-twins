import * as interfaces from './interfaces';
function api() {

}

export const fetchSensors = async (): Promise<interfaces.sensor[]> => {
    const response = await fetch('http://192.168.3.105/api/v1/sensors');
    const sensors: interfaces.sensor[] = await response.json()
    return sensors;
}

export const fetchZones = async (): Promise<interfaces.zone[]> => {
    const response = await fetch('http://192.168.3.105/api/v1/zones');
    const zones: interfaces.zone[] = await response.json()
    return zones;
}


export const fetchTemperature = (): interfaces.temperatureSensorValue[] => {
    let temperatures: interfaces.temperatureSensorValue[] = []
    fetchSensors().then((sensors: interfaces.sensor[]) => {
        let requestUrl = "http://192.168.3.105/api/v1/realtime/sensor?&"
        sensors.forEach((sensor) => {
            console.log(sensor, sensor.id.includes("IAQsensor"))
            if (sensor.id.includes("IAQsensor")) {
                requestUrl.concat("id=", sensor.id, "&")
            }
        })
        console.log(requestUrl)
    })
    return temperatures;
}
export default api;