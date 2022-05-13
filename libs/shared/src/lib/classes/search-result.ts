

export class SearchResult {
    constructor(private name: string, private imgUrl: string, private id:string) { }

    getName():string{
        return this.name;
    }
    getimgUrl():string{
        return this.imgUrl;
    }
    getID():string{
        return this.id;
    }
}
