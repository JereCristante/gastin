export class LoginUser{
    email!: String;
    password!: String;
    constructor(email: string, password: string){
        this.email=email;
        this.password=password;
    }
}