import { Category } from "./CategoryInterface";
import { Wallet } from "./WalletInterface";

export interface Movement{
    id: number;
    description: String;
    amount: number;
    date: Date;
    user: number;
    account: Wallet;
    destinationAccount?: Wallet;
    category: Category;
    movementType: number;
    active: boolean;
};