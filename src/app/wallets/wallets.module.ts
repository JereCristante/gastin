import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletsPageRoutingModule } from './wallets-routing.module';

import { WalletsPage } from './wallets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    WalletsPageRoutingModule
  ],
  declarations: [WalletsPage]
})
export class WalletsPageModule {}
