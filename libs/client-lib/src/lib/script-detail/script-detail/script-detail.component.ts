import { Component, OnInit,ViewChild } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../shared/services/comments/comment.service';
import { rating } from '../../shared/models/scripts/rating';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { ReportService } from '../../shared/services/reports/report.service';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { oldScript } from '../../shared/models/scripts/old-script';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { StorageService } from '../../shared/services/storage/storage.service';
import { ModelsService } from '../../shared/services/models/models.service';
import * as tf from '@tensorflow/tfjs'

@Component({
  selector: 'board-game-companion-app-script-detail',
  templateUrl: './script-detail.component.html',
  styleUrls: ['./script-detail.component.scss'],
})
export class ScriptDetailComponent implements OnInit {
  current!: automataScript;
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  boardGameName = "";
  showComments = true;
  numberOfComments = 0;
  rate:rating = {_id:"",user:{name:"",email:""},script:"",value:0};
  averageRating = 0;
  voterCount = 0;
  downloading = false;
  alreadyReported = false;
  oldies:oldScript[] = []
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly scriptService:ScriptService,
    private readonly boardGameService:BggSearchService,
    private readonly commentService:CommentService,
    private readonly router:Router,
    private route: ActivatedRoute,
    private readonly gapi: GoogleAuthService,
    private readonly reportService:ReportService,
    private networkService: OnlineStatusService,
    private storageService: StorageService,
    private modelsService: ModelsService
    ) {
      this.current = this.router.getCurrentNavigation()?.extras.state?.['value'];

      this.networkService.status.subscribe((status: OnlineStatusType) =>{
        this.status = status;
      });      
  }

  ngOnInit(): void {

    if(this.current !== null || this.current !== undefined){
      this.getBoardGameName();
      this.countComments();
      this.getRating();
      this.getAverageRating();
      this.getVoterCount();
      this.getAlreadyReported();
      this.getOldies();
    } 
  }

  getOldies(): void{
    this.scriptService.getOldVersions(this.current.name,this.current.author).subscribe({
      next: (value:oldScript[]) => {
        this.oldies = value;
      },
      error: (err) => {
        this.notifications.add({type:"danger",message:`Failed to retrieve older versions of ${this.current.name}`})
      }
    })
  }

  download(): void{
    if(this.status === OnlineStatusType.OFFLINE){
      this.notifications.add({type:"warning",message:`You must be online to download ${this.current.name}`});
      return;
    }
    
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:`You must be logged In to download ${this.current.name}`});
      return;
    }

    if(this.downloading)
      return;

    this.scriptService.alreadyDownloaded(this.current.author,this.current.name,this.current.version).subscribe({
      next:(value:boolean) => {
        if(value){
          this.notifications.add({type:"warning",message:`You have already downloaded ${this.current.name}`})
        }else{
          this.downloading = true;
          this.scriptService.download(this.current._id).subscribe({
            next:(val:downloadScript)=>{
              if(val === null){
                this.notifications.add({type: "danger",message: `Could not find ${this.current.name}`})
                this.downloading = false;
              }

                this.modelsService.getModelsByIdOnly(val.models).subscribe({
                  next:(models:any) => {
                    models.forEach((network:any) => {
                      this.storageService.insert("networks",network).then(async(res:string) => {
                        const imodel = await tf.loadLayersModel(network.model.location);
                        await imodel.save(`indexeddb://${network.name}`);
                      }).catch(()=> this.notifications.add({type:"warning",message:"something went wrong when loading model"}))
                    })

                    this.storageService.insert("downloads",val).then((res:string)=>{
                      this.downloading = false;
                      this.notifications.add({type:"success",message:`Successfully downloaded ${this.current.name}`});
                    }).catch(() =>{
                      this.downloading = false;
                      this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
                    })

                  },
                  error:(err) => {
                    this.downloading = false;
                    console.log(err);
                    this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
                  }
                })
            },
            error:(err)=>{     
              this.downloading = false;
              console.log(err);
              this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
            }      
          });
        }
      },
      error:()=>{
        this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
      }
    })
  }

  convertBytes(value:number): string{
    const decimals = 2;
    const kilo = 1024;
    const deci = decimals < 0 ? 0 : decimals;
    const ranges = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if(value === 0)
      return '0 B';
    const i = Math.floor(Math.log(value) / Math.log(kilo));

    return parseFloat((value / Math.pow(kilo, i)).toFixed(deci)) + ' ' + ranges[i];
  }

  toggleComments(){
    this.showComments = !this.showComments;
  }

  
  getBoardGameName():void{
    this.boardGameService.getBoardGameById(this.current.boardgame).subscribe({
      next:(val)=>{
        this.boardGameName = this.boardGameService.parseGetBoardGameById(val.toString()).name;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  getAlreadyReported():void{
    this.reportService.alreadyIssued(this.current._id).subscribe({
      next:(value:boolean) => {
        this.alreadyReported = value;
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  getRating(): void{
    this.scriptService.getRating({name:sessionStorage.getItem("name") as string,email:sessionStorage.getItem("email") as string},this.current._id).subscribe({
      next:(val)=>{
        if(val !== null)
          this.rate = val;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  getAverageRating(): void{
    this.scriptService.averageRating(this.current._id).subscribe({
      next:(val)=>{
        this.averageRating = val;
      },
      error:(err)=>{
        console.log(err);
      }
    });   
  }

  getVoterCount(): void{
    this.scriptService.countRating(this.current._id).subscribe({
      next:(val)=>{
        this.voterCount = val;
      },
      error:(err)=>{
        console.log(err);
      }
    });      
  }

  rateScript(val:number): void{
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:"You must be logged In to rate the script."});
      return;
    }

    this.scriptService.rate({name:sessionStorage.getItem("name") as string,email:sessionStorage.getItem("email") as string},this.current._id,val).subscribe({
      next:(val)=>{
        this.getAverageRating();
        this.getVoterCount();
        this.rate = val;
      },
      error:(err)=>{
        console.log(err);
      }      
    })
  }

  formatDate(date:Date):string{
    let result = "";
    
    const val = new Date(date);

    result = (val.getDate() < 10 ? "0": "") + val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += (val.getHours() < 10 ? "0" : "") + val.getHours() + ":" + (val.getMinutes() < 10 ? "0" : "") + val.getMinutes() + ":" + (val.getSeconds() < 10 ? "0" : "") + val.getSeconds();

    return result;
  }

  incrementCommentCounter(): void{
    this.numberOfComments++;
  }

  play(){
    const id = this.current._id
    this.router.navigate(['scriptExecutor', {my_object: id}]);
  }

  countComments(): void{
    this.commentService.countComments(this.current._id).subscribe({
      next:(value)=>{
        this.numberOfComments = value;
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });
  }
}
