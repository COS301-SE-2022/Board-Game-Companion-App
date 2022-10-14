class cards
{
    name = "";
    State = null
    constructor(n, s)
    {
        this.name = n;
        this.State = s;
    }
    //cardEffect
    
    //cardCondition
    
    async activate()
    {
        activate("")
    }
    async canUse()
    {
        canUse("")
    }
    async activate(parameters)
    {
        switch(this.name)
        {
            //cardActivation
        }
    }
    async canUse(parameters)
    {
        switch(this.name)
        {
            //cardUsable
        }
        return false;
    }

    async getPlayer(s)
    {
        let i = await indexOfPlayer(s)
        return this.State.players[i]
    }


}
//cards

class tile
{
    Name = "";//name for the tile identifier as string by default
    Id = 0; //unique identifier for the tile 0 by default
    Type = ""; //allows grouping of tyles by a type “” by default
    pieces = []; //array of pieces on this tile [] by default
    Adjacencies = []; //array of tiles adjacent to this tile [] by default
 
    //tile properties
    async removePiece(p)
    {
        const index = this.pieces.indexOf(p);
        if (index > -1) 
        { 
            this.pieces.splice(index, 1); 
        }
    }
}
class piece
{
    Id; //unique id for a piece 0 by default
    Type; //grouping information for the piece “” by default
    Player; //the player this piece belongs to
    Tile; //the tile this piece is on
    
}

async function movePiece(p, t)
{
    await p.Tile.removePiece(p)
    p.Tile = t
    t.pieces.push(p)
}


class game_state
{
    board = []
    players = [
        
    ]
    constructor()
    {
        //State
        

        
        //tiles

        
    }

    

//state accessors
    async getTileByID(id)
    {
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Id == id)
                return this.board[i]
        }
        return null
    }

    async getTilesByType(type)
    {
        results = []
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Type == type)
                results.push(this.board[i])
        }
        return results
    }
}




class player
{
    State = new game_state();
    async chooseAction()
    {
        //
    }
    async turn()
    {
        //redefined in subclasses
    }
}
//players

async function indexOfPlayer(s)
{
    switch(s)
    {
        //playerIndexes
    }
    return 0
}

//
class script
{
    State = new game_state();
    players = [
        //add players
    ]
    listOfPlayers = [
        //playerList
    ]
    async getPlayer(s)
    {
        let i = await indexOfPlayer(s)
        return this.State.players[i]
    }

    async play()
    {
        this.State.players = this.players
        
        //console.log("script-execution begins");
            
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.State
            
        }
        //get player turn order
        let order = []
        //let inputElement = document.getElementById("TextOutput");
        await setCurrPlayer("GAME SETUP")
        
        for(let i =0;i< this.players.length && !interrupt();i++)
        {
            
            //ask using input and output methods
            let pIndex =await input("when will player "+this.players[i].constructor.name + " move", "text")
            pIndex = +pIndex
            order.push(pIndex)
        }
        //re order 
        for(let i =0;i< this.players.length;i++)
        {
            for(let j =1;j< this.players.length;j++)
            {
                if(order[i]> order[j])
                {
                    let temp = order[i]
                    let tempP = this.players[i]
                    let tempPL = this.listOfPlayers[i]

                    order[i] = order[j]
                    this.players[i] = this.players[j]
                    this.listOfPlayers[i] = this.listOfPlayers[j]

                    order[j] = temp
                    this.players[j] = tempP
                    this.listOfPlayers[j] = tempPL
                }
            }
        }
        do
        {
            for(let i =0;i< this.players.length && !await this.endgame();i++)
            {
                await setCurrPlayer(this.listOfPlayers[i])
                await this.players[i].turn();
            }
        }
        while(!await this.endgame() && !interrupt())

        
    }
    
    async endgame()
    {
        //end_game
        
    
        return true
    }
    


}

(new script()).play();