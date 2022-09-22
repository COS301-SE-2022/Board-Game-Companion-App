import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { AdminScriptsComponent } from './admin-scripts/admin-scripts.component';
import { AdminOthersComponent } from './admin-others/admin-others.component';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    AdminUsersComponent,
    AdminReportsComponent,
    AdminScriptsComponent,
    AdminOthersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgChartsModule,
    SharedModule,
    RouterModule.forChild([{path:'',component:AdminComponent}])
  ]
})
export class AdminModule { }