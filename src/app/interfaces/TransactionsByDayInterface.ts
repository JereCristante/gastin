export class TransactionsByDay{
    amount!:number;
    date!:string;
    constructor(date: string, amount: number){
        this.date=date;
        this.amount=amount
    }
}