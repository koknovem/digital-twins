import { NumberKeyframeTrack } from "three"

export interface sensor {
    name: string,
    posX: number,
    posY: number,
    type: string,
    data: any,
    time: string,
}

export interface zone {
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

export interface robot {
    online: number,
    "robot-cs": any,
    "robot-patrol": any,
    "robot-sanitize": any,
    total: number,
}