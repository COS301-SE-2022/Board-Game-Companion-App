

export class SearchResult {
    constructor(private name: string, private imgUrl: string) { }

    getName():string{
        return this.name;
    }
    getimgUrl():string{
        return this.imgUrl;
    }
}
