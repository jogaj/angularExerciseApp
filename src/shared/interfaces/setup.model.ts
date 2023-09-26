import { Zones } from "../enums/zones.enum";

export interface Setup {
    qtyRounds?: number,
    qtyExercises?: number,
    totalMinPerExcercise?: number,
    timeoutTime?: number,
    qtyPeople?: number,
    zone?: Zones
}

// export interface Setup {
//     qtyRounds: number,
//     qtyExercises: number,
//     totalMinPerExcercise: number,
//     timeoutTime: number,
//     qtyPeople: number,
//     zone: Zones
// }