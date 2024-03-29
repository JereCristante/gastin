import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'wallets',
        loadChildren: () => import('../wallets/wallets.module').then(m => m.WalletsPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: '',
        redirectTo: '/gastin/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/gastin/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
