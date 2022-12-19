import { NumberKeyframeTrack } from "three"

export interface sensor {
    extra: string,
    id: string,
    name: string,
    position: {
        x: number,
        y: number,
        z: number
    },
    scale: number,
    shartName: string,
    type: string,
    visible: boolean,
}

export interface zone {
    extra: string,
    id: string,
    modelName: string,
    name: string,
    storey: string
}

export interface robot {
    online: number,
    "robot-cs": any,
    "robot-patrol": any,
    "robot-sanitize": any,
    total: number,
}

export interface iaqSensor{
    time: string,
    HCHO_UGM3: number,
    PM25_UGM3: number,
    TVOC_UGM3: number,
    CO2_PPM: number,
    TEMPERATURE: number,
    HUMIDITY: number,
    PM10_UGM3: number
}

export interface temperatureSensorValue{
    time: string,
    value: string
}