import { Category } from "./CategoryInterface";
import { Wallet } from "./WalletInterface";

export interface Movement{
    description: string;
    amount: number;
    category?: String;
    account?:String;
    movementType?: number;
};