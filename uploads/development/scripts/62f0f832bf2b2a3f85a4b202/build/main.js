class cards
{
    parameters;
    async activate()
    {
        //
    }
    async canUse()
    {
        return true;
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
 
    //possibly functions to make the scripters life easier like:
    
}
class piece
{
    Id; //unique id for a piece 0 by default
    Type; //grouping information for the piece “” by default
    Player; //the player this piece belongs to
    Tile; //the tile this piece is on
    
}
class game_state
{
    board = []
    constructor()
    {
        
let b = new tile()

//State
        

        
        this.board.push(b)
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
class Joseph extends player { 
    Actions = [
        
    ]

    

    


    params = []
    async chooseAction(choice, p)
    {
        switch(choice)
        {
            
        }
        
        
    }
    async isActionLegal(choice, p)
    {
        switch(choice)
        {
            
            
        }
        
        return false;
    }

    async considerations(choice)
    {
        
        switch(choice)
        {
            
        }
        
        return [];
    }
    async generateChoices()
    {
        this.params = []
        let choices =[]
        
        for(let i = 0;i<this.Actions.length;i++)
        {
            

            if(await this.considerations(i) == [])
            {
                if(await this.isActionLegal(i, []))
                {
                    choices.push(i)
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<await this.considerations(i).length;j++)
                {
                    
                    
                    if(await this.isActionLegal(i, await this.considerations(i)[j]))
                    {
                        choices.push(i)
                        this.params.push(await this.considerations(i)[j])

                    }
                }
            }
        }
        
        return choices
    };async turn ( ){ let x =  'text' 
await input( x ,  'text' ) 
}} //players



//
class script
{
    State = new game_state();
    players = [
        new Joseph(),//add players
    ];
    


    async play()
    {

        
        console.log("script-execution begins");
            
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.State
        }
        //get player turn order
        let order = []
        let inputElement = document.getElementById("TextOutput");
        
        for(let i =0;i< this.players.length;i++)
        {
            if(inputElement)
            {
                //ask using input and output methods
                order.push(await input("when will player "+this.players[i].constructor.name + " move"), "text")
            }
            else
            {
                //use default order
                order.push(i)
            }
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

                    order[i] = order[j]
                    this.players[i] = this.players[j]

                    order[j] = temp
                    this.players[j] = tempP
                }
            }
        }
        do
        {
            for(let i =0;i< this.players.length && !await this.endgame();i++)
            {
                await this.players[i].turn();
            }
        }
        while(!await this.endgame())

        
    }
    
    async endgame()
    {
        let x = false 
return x 
//end_game
    
    
        return false
    }
    


}

(new script()).play();