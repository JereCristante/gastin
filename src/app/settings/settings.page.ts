import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';
import { Category } from '../interfaces/CategoryInterface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user?:User;
  spentCategories:Category[]=[];
  incomeCategories:Category[]=[];
  icons:string[]=[
    "airplane-outline",
    "bag-handle-outline",
    "bandage-outline",
    "barbell-outline",
    "book-outline",
    "construct-outline",
    "bus-outline",
    "bookmark-outline",
    "business-outline",
    "cafe-outline",
    "call-outline",
    "car-sport-outline",
    "card-outline",
    "cart-outline",
    "cash-outline",
    "color-palette-outline",
    "desktop-outline",
    "documents-outline",
    "fast-food-outline",
    "film-outline",
    "flame-outline",
    "flash-outline",
    "football-outline",
    "game-controller-outline",
    "gift-outline",
    "home-outline",
    "key-outline",
    "language-outline",
    "menu-outline",
    "musical-notes-outline",
    "moon-outline",
    "nutrition-outline",
    "receipt-outline",
    "reader-outline",
    "restaurant-outline",
    "school-outline",
    "storefront-outline",
    "ticket-outline",
    "wifi-outline",
    "water-outline",
    "logo-steam",
    "logo-usd"];
  selectedIcon:string="";
  iconColor:string="#D11F1F";
  selectedType:number=1;
  //@Output() sizeChange = new EventEmitter<number>();
  validatorCategory: FormGroup;
  constructor(public fb:FormBuilder,private uS:UserService, private modalController: ModalController) { 
    this.validatorCategory = this.fb.group({
      description: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit() {
    this.uS.getUserInfoByEmail(sessionStorage.getItem('AuthEmail')!).subscribe(
      data=> {
        this.user=data;
        this.refreshCategories();
      },
      error => {
        // Manejar el error aquí
          //if(error.status!=200){
            alert(error.error);
            console.log(error)
          //}
      }
    );
  }
  refreshCategories(){
    this.uS.getCategoriesByUser(this.user!.id,1).subscribe(
      data=> {
        this.spentCategories=data;
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
          console.log(error)
        //}
        
      }
    );
    this.uS.getCategoriesByUser(this.user!.id,2).subscribe(
      data=> {
        this.incomeCategories=data;
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
          console.log(error)
        //}
        
      }
    );
  }
  closeModal() {
    this.refreshCategories();
    this.validatorCategory.reset();
    this.modalController.dismiss();
    this.iconColor="";
  }
  cancel() {
    this.closeModal();
  }

  confirm() {
    this.modalController.dismiss();
  }
  newCategory(value:any){
    console.log(this.validatorCategory.value);
    if(this.selectedIcon==""){
        alert('Debe seleccionar un icono');
        return;
    }
    let newCategory: Category = new Category(value.description,this.selectedIcon);
    this.uS.newCategory(this.user!.id,this.selectedType,newCategory).subscribe(
      data=> {
        this.validatorCategory.reset();
        this.closeModal();
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
          console.log(error)
        //}
        
      }
    );
  }
  changeIcon(icon:string){
    this.selectedIcon=icon;

  }
  typeChanged(value:any){
    console.log(value.detail.value);
    if(value.detail.value == 1){
      this.iconColor="#D11F1F";

    }
    if(value.detail.value == 2){
      this.iconColor="#3FC53C";
    }
  }
}
