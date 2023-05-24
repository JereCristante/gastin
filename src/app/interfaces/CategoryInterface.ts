export class Category{
    id?: number;
    description: string;
    icon: string;
    constructor(description: string, icon: string){
        this.description=description;
        this.icon=icon
    }
}