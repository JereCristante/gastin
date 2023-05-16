export class NewMovement{
    description: string ='';
    amount: number = 0;
    date: Date = new Date();
    active?: boolean;
    constructor(description: string, amount: number,date:Date,active?:boolean){
        this.description=description;
        this.amount=amount;
        this.date=date;
        this.active=active;
    }
};