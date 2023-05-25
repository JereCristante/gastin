import { Category } from "./CategoryInterface";
import { Wallet } from "./WalletInterface";

export interface Movement{
    description: string;
    amount: number;
    category?: number;
    account?:string;
    categoryObj:Category;
    movementType?: number;
};