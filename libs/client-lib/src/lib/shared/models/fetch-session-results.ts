export class fetchSessionResults{
    constructor(private boardGame: string, private script: string, private timePlayed: string, private date: string, private numOpponents: string, private score: string, private result:string, private id: string) {}

    getBoardGame(): string{
        return this.boardGame
    }
    getScript(): string{
        return this.script
    }
    getTimePlayed(): string{
        return this.timePlayed
    }
    getDate(): string{
        return this.date
    }
    getID(): string{
        return this.id
    }
    getNumOpponents(): string{
        return this.numOpponents
    }
    getScore(): string{
        return this.score
    }
    getResult(): string{
        return this.result
    }
}