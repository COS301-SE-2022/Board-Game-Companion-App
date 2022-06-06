import { Injectable } from '@angular/core';

export interface scriptFace{
  date:string,
  author:string,
  name:string,
  status:string
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  dummyArray: scriptFace[]=
  [{
    date:"09 June 2012",
    author:"John Mahleza",
    name:"chess",
    status: "Active"
  },{
    date:"04 September 2022",
    author:"Omega Alpha",
    name:"root",
    status: "Active"
  },{
    date:"17 August 2021",
    author:"Steven",
    name:"monopoly",
    status: "Flagged"
  },{
    date:"30 February 2012",
    author:"Keita ",
    name:"checkers",
    status: "Active"
  },{
    date:"13 March 2010",
    author:"Thomas",
    name:"candy land",
    status: "flagged"
  },{
    date:"17 June 2015",
    author:"Nomthi",
    name:"Go",
    status: "flagged"
  },{
    date:"25 April 2014",
    author:"Alfred",
    name:"Catan",
    status: "flagged"
  },{
    date:"09 January 2012",
    author:"Smith Bob",
    name:"Scrabble",
    status: "Active"
  }];
  constructor() { }

  getScripts():scriptFace[]{
    return this.dummyArray;
  }
}
