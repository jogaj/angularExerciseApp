import { Zones } from "../enums/zones.enum";

export interface Exercise {
    type: Zones,
    title: string,
    url?: string
}