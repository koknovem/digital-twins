export interface sensor {
    name: string,
    posX: number,
    posY: number,
    type: string,
    data: any,
    time: string,
}

export interface zone {
    name: string,
    width: number,
    height: number,
    posX: number,
    posY: number,
    time: string,
    data: any,
    group: number,
}

export interface robot {
    online: number,
    "robot-cs": any,
    "robot-patrol": any,
    "robot-sanitize": any,
    total: number,
}