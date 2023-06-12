import { Movement } from "./MovementInterface";

export class newSchedule{
    day: number;
    total_payments: number;
    payed: number;
    active: boolean;
    original_movement_id: movementId={id:0};
    constructor(day:number,total_payments:number,payed:number,active:boolean,original_movement_id:number){
        this.day=day;
        this.total_payments=total_payments;
        this.payed=payed;
        this.active=active;    
        this.original_movement_id.id=original_movement_id;
    }
}
export interface movementId{
    id:number;
}