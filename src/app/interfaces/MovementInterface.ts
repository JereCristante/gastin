import { Category } from "./CategoryInterface";
import { Wallet } from "./WalletInterface";

export interface Movement{
    id:number;
    description: string;
    amount: number;
    category?: number;
    account?:number;
    date?:Date;
    categoryObj:Category;
    accountObj:Wallet;
    movementType?: number;
};