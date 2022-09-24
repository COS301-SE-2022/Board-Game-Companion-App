import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../shared/services/admin/admin.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { user } from '../../shared/models/general/user';
import { moderator } from '../../shared/models/admin/moderator';
import { Subscription } from 'rxjs';
import { userSearch } from '../../shared/models/admin/userSearch';
import { ban } from '../../shared/models/admin/ban';

@Component({
  selector: 'board-game-companion-app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    }
  };
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ 'Collection Owners', 'Script Authors', 'Script Downloaders'],
    datasets: [ {
      data: [ 0, 0, 0 ]
    } ]
  };
  pieChartType: ChartType = 'pie';
  email = "";
  searchValue = "";
  activeAccount = 0;
  loggedInUsers = 0;
  totalAccount = 0;
  moderators:moderator[] = []
  subscriptions:Subscription = new Subscription();
  selectAdmin:moderator | undefined;
  selectModerator:moderator | undefined;
  searchResults:userSearch[] = [];

  constructor(private readonly adminService:AdminService){}

  ngOnInit(): void {
    this.loadModerators();
    this.initData();
    this.getInitialActiveUsers();
    this.getInitialLoggedInUsers();
    this.getActiveAccounts();
    this.getTotalAccounts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkInputOnEnter(value:any): void{

    if(value.key === "Enter"){
      value?.preventDefault();
      this.addModerator();
    }
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

  getTotalAccounts(): void{
    this.adminService.getTotalAccounts().subscribe({
      next:(value:number) => {
        this.totalAccount = value;
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to count total accounts"});
      }
    })
  }

  getInitialActiveUsers(): void{
    this.adminService.getInitialActiveAccounts().subscribe({
      next:(value:number) => {
        this.activeAccount = value;
      }
    })
  }

  getInitialLoggedInUsers(): void{
    this.adminService.getInitialLoggedUsers().subscribe({
      next:(value:number) => {
        this.loggedInUsers = value;
      }
    })
  }

  enumerate(x:number): number[]{
    const result:number[] = [];

    for(let count = 0; count < x; count++)
      result.push(count);

    return result;
  }

  loginEvent(): void{
    const subscription = this.adminService.login().subscribe({
      next:(value:number) => {
        this.loggedInUsers = value;
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to count logged in accounts."})
      }
    })

    this.subscriptions.add(subscription);
  }

  logoutEvent(): void{
    const subscription = this.adminService.logout().subscribe({
      next:(value:number) => {
        this.loggedInUsers = value;
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to count logged in accounts."})
      }
    })

    this.subscriptions.add(subscription);
  }

  getActiveAccounts(): void{
    const subscription =  this.adminService.activeUsers().subscribe({
      next:(value:number) => {
        this.activeAccount = value;
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to count active accounts."})
      }
    })

    this.subscriptions.add(subscription);
  }

  search(): void{
    this.adminService.search(this.searchValue).subscribe({
      next:(value:userSearch[]) => {
        this.searchResults = value;
      },
      error:() => {
        this.notifications.add({type:"danger",message:"Search Failed."});
      }
    })
  }


  validateEmail(): boolean{
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
      return true

    return false;
  }

  isAdmin(value:userSearch): boolean{
    const emails = this.moderators.map((value)=>value.email);
    return emails.includes(value.email);
  }

  unban(value:userSearch): void{
    this.adminService.unban(value.email).subscribe({
      next:(response:ban) =>{
        if(response === null){
          this.notifications.add({type:"warning",message:"Could not find banned account"});
          return;
        }

        this.notifications.add({type:"success",message:`Successfully unbanned the account belonging to '${value.name}'`});
        value.banned = false;
      },
      error:()=>{
        this.notifications.add({type:"danger",message:'Failed to unban account'})
      }
    })
  }

  ban(value:userSearch): void{
    this.adminService.ban(value.name,value.email).subscribe({
      next:(response:ban) => {
        if(response === null){
          this.notifications.add({type:"warning",message:`${value.name} already banned`});
          return;
        }
        this.notifications.add({type:"warning",message:`Successfully banned ${response.user.name}`});
        value.banned = true;
      },
      error:()=>{
        this.notifications.add({type:"danger",message:`Failed to ban ${value.name}`})
      }
    })
  }

  getAdmin(): moderator[]{
    return this.moderators.filter((value:moderator) => value.admin)
  }

  getModerators(): moderator[]{
    return this.moderators.filter((value:moderator) => !value.admin)
  }

  addModerator(): void{
    if(this.email === ""){
      this.notifications.add({type:"danger",message:"Email is empty."});
      return;
    }

    if(!this.validateEmail()){
      this.notifications.add({type:"danger",message:"Invalid email."});
      return;
    }

    this.adminService.create(this.email).subscribe({
      next:(value:moderator) => {
        if(value === null){
          this.notifications.add({type:"warning",message:`Moderators with email '${this.email}' already exists.`});
          this.email = "";
          return;
        }

        this.moderators.push(value);
        this.email = "";
        this.notifications.add({type:"success",message:`Successfully created new moderator with email '${this.email}'`})
      },
      error:()=>{
        this.notifications.add({type:"warning",message:`Failed to create moderator with email '${this.email}'`});
        this.email = "";
      }
    })
  }

  removeModerator(value:moderator):void{
    this.adminService.remove(value._id).subscribe({
      next:(response:moderator) => {
        this.moderators = this.moderators.filter((val:moderator) => val._id !== response._id);
        this.notifications.add({type:"success",message:`Successfully removed moderator with email '${this.email}'`});
      },
      error:() => {
        this.notifications.add({type:"warning",message:`Failed to remove moderator with email '${value.email}'`});
      }
    })
  }

  loadModerators(): void{
    this.adminService.getAll().subscribe({
      next:(value:moderator[]) =>{
        this.moderators = value;
      },
      error:() =>{
        this.notifications.add({type:"warning",message:"Failed to load moderator details."});
      }
    });
  }

  initData(): void{
    this.adminService.countCollectionOwners().subscribe({
      next:(value:number) => {
        this.pieChartData.datasets[0].data[0] = value;
        this.chart?.update();
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count collections"});
      }
    })
    

    this.adminService.countScriptAuthors().subscribe({
      next:(value:number) => {
        this.pieChartData.datasets[0].data[1] = value;
        this.chart?.update();
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count script authors"});
      }
    })

    this.adminService.countDownloaders().subscribe({
      next:(value:number) => {
        this.pieChartData.datasets[0].data[2] = value;
        this.chart?.update();
      },
      error:()=>{
        this.notifications.add({type:"warning",message:"Failed to count downloaders"});
      }
    })
  }


  setModerator(value:moderator): void{
    if(value === this.selectModerator){
      this.selectModerator = undefined;
      return
    }

    this.selectModerator = value;
  }

  setAdmin(value:moderator): void{
    if(value === this.selectAdmin){
      this.selectAdmin = undefined;
      return;
    }

    this.selectAdmin = value;
  }

  moveAdmin(): void{
    if(this.selectAdmin === undefined)
      return;

    this.adminService.setAdmin(this.selectAdmin._id,false).subscribe({
      next:(value:moderator) => {
        if(this.selectAdmin !== undefined)
          this.selectAdmin.admin = value.admin;

        this.notifications.add({type:"success",message:`Successfully moved '${this.selectAdmin?.email}' to moderator`})
        this.selectAdmin = undefined;
      },
      error:() => {
        this.notifications.add({type:"warning",message:`Failed to move '${this.selectAdmin?.email}' to moderator status.`})
      }
    })
  }

  moveModerator(): void{
    if(this.selectModerator === undefined)
      return;

    this.adminService.setAdmin(this.selectModerator._id,true).subscribe({
      next:(value:moderator) => {
        if(this.selectModerator !== undefined)
          this.selectModerator.admin = value.admin;

        this.notifications.add({type:"success",message:`Successfully moved '${this.selectModerator?.email}' to admin`})
        this.selectModerator = undefined;
      },
      error:() => {
        this.notifications.add({type:"warning",message:`Failed to move '${this.selectAdmin?.email}' to moderator status.`})
      }
    })
  }
}
