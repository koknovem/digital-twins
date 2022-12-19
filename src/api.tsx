import * as interfaces from './interfaces';
function api() {

}

export const getTemperature = async (): Promise<interfaces.sensor[]> => {
    const response = await fetch('http://192.168.3.105/api/sensors');
    const sensors:interfaces.sensor[] = await response.json()
    return sensors;
}

export const getZones = async ():Promise<interfaces.zone[]> =>{
    const response = await fetch('http://192.168.3.105/api/v1/sensors');
    const zones:interfaces.zone[] = await response.json()
    return zones;

}
export default api;