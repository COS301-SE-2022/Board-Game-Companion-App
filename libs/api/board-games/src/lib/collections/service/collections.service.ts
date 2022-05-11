import { Injectable } from '@nestjs/common';
import { collection } from '../models/collection';

@Injectable()
export class CollectionsService {
    private data:collection[] = [
        {
            owner:"Joseph Makgopa",
            name:"favourite",
            description:"This is a list of my favourite board games",
            boardGames: ["Chess","Scrabble"]
        },{
            owner:"Kyle Haarhoff",
            name:"favourite",
            description:"This is a list of my favourite boardgames",
            boardGames: ["Root,Monopoly"]
        },{
            owner:"Nasiphi Mjobo",
            name:"favourite",
            description:"This is a list of my favourite boardgames",
            boardGames: ["Monopoly,Scrabble"]
        },{
            owner:"Matthew Marsden",
            name:"favourite",
            description:"This is a list of my favourite boardgames",
            boardGames: ["Root,Monopoly"]
        },{
            owner:"Njabulo Ntuli",
            name:"Abstract Strategy Board Game",
            description:"This is a list of my favourite abstract strategy boardgames",
            boardGames: ["Chess,Checkers,Go"]
        }
    ];


    create(input:collection): string{
        if(!input.owner || input.owner == ""){
            return "owner of collection needs to be set";
        }else if(!input.name || input.name == ""){
            return "name of collection needs to be set";
        }else{
            this.data.push(input);
        }
    }

    getCollectionByUser(owner: string): collection[]{
        let result:collection[] = [];

        for(let count = 0; count < this.data.length; count++){
            if(owner === this.data[count].owner){
                result.push(this.data[count]);
            }
        }

        return result;
    }

    addBoardGame(boardgame:string,name:string,owner:string): boolean{
        let result = false;

        for(let count = 0; count < this.data.length; count++){
            if(this.data[count].name == name && this.data[count].owner == owner){
                this.data[count].boardGames.push(boardgame);
                result = true;
            }
        }

        return result;
    }

    removeCollection(owner:string,name:string):boolean{
        let temp:collection[] = [];
        let result = false;

        if(!owner || !name || name === "" || owner == "")
            return false;

        for(let count = 0; count < this.data.length; count++){
            if(this.data[count].owner == owner && this.data[count].name == name){
                continue;
                result = true;
            }else
                temp.push(this.data[count]);
        }

        this.data = temp;

        return result;
    }
}
