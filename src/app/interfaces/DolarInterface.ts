export interface Dolar{
    oficial:coin;
    blue:coin;
    last_update: Date;
}
export interface coin{
    value_avg:number;
    value_sell:number;
    value_buy:number;
}