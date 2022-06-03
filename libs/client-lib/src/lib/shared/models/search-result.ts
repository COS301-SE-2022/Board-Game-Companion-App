

export class SearchResult {
    constructor(private name: string, private imgUrl: string, private age: string, private designer: string, private minPlayers: string, private maxPlayers: string, private minPlayTime:string, private maxPlayTime:string, private category:string, private id:string) { }

    getName():string{
        return this.name;
    }
    getimgUrl():string{
        return this.imgUrl;
    }
    getID():string{
        return this.id;
    }
    getAge():string{
        return this.age;
    }
    getDesigner():string{
        return this.designer;
    }
    getMinPlayers():string{
        return this.minPlayers;
    }
    getMaxPlayers():string{
        return this.maxPlayers;
    }
    getMinPlayTime():string{
        return this.minPlayTime;
    }
    getMaxPlayTime():string{
        return this.maxPlayTime;
    }
    getCategory():string{
        return this.category;
    }
    
}
