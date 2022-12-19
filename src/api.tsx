import * as interfaces from './interfaces';
function api() {

}

export const getTemperature = async (): Promise<interfaces.sensor[]> => {
    const response = await fetch('http://192.168.3.105/api/v1/realtime/sensor?id=robot-cs&id=robot-patrol&id=robot-sanitize');
    const sensors:interfaces.sensor[] = await response.json()
    return sensors;
}

export default api;