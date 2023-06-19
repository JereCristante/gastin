import { CategoryTotal } from "./CategoryTotalInterface";

export interface CategoryTotalUser{
    categories: CategoryTotal[],
    userName:string,
    total:number
}