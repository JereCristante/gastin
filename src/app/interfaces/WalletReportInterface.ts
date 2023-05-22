import { Movement } from "./MovementInterface";
import { Wallet } from "./WalletInterface";

export interface WalletReport{
    account: Wallet;
    movements: Movement[];
}