import { Movement } from "./MovementInterface";

export interface Schedule{
    id: number;
    day: number;
    payed: number;
    total_payments: number;
    original_movement_id: Movement;
    active: boolean;
}